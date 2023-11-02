import { NextResponse } from 'next/server';
import { connectToDB } from "@/lib/mongoose";
import LeaveBalance from '@/models/leaveBalance.model';

export const dynamic = 'force-dynamic';
export async function GET() {
    try {
        connectToDB();


        const allBalances = await LeaveBalance.find();


        for (let balance of allBalances) {
            balance.Balance += 2.5;
            await balance.save();
        }

        return NextResponse.json({ message: 'Leave balances updated successfully' });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update leave balances' });
    }
}
