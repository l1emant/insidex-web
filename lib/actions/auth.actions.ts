'use server';

import {auth} from "@/lib/better-auth/auth";
import {inngest} from "@/lib/inngest/client";
import {headers} from "next/headers";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({ body: { email, password, name: fullName } })

        if(response) {
            await inngest.send({
                name: 'app/user.created',
                data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry }
            })
        }

        return { success: true, data: response }
    } catch (e) {
        console.log('Sign up failed', e)
        return { success: false, error: 'Sign up failed' }
    }
}

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({ body: { email, password } })

        return { success: true, data: response }
    } catch (e) {
        console.log('Sign in failed', e)
        return { success: false, error: 'Sign in failed' }
    }
}

export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() });
        return { success: true };
    } catch (e) {
        console.log('Sign out failed', e)
        return { success: false, error: 'Sign out failed' }
    }
}

// Add stock to watchlist
export const addToWatchlist = async (symbol: string, company: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect('/sign-in');

    // Check if stock already exists in watchlist
    const existingItem = await Watchlist.findOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
    });

    if (existingItem) {
      return { success: false, error: 'Stock already in watchlist' };
    }

    // Add to watchlist
    const newItem = new Watchlist({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
      company: company.trim(),
    });

    await newItem.save();
    revalidatePath('/watchlist');

    return { success: true, message: 'Stock added to watchlist' };
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw new Error('Failed to add stock to watchlist');
  }
};

// Remove stock from watchlist
export const removeFromWatchlist = async (symbol: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect('/sign-in');

    // Remove from watchlist
    await Watchlist.deleteOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
    });
    revalidatePath('/watchlist');

    return { success: true, message: 'Stock removed from watchlist' };
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw new Error('Failed to remove stock from watchlist');
  }
};