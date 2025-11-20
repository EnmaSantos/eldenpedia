import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import SettingsForm from '@/components/SettingsForm';

export default async function SettingsPage() {
    // const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-amber-500 tracking-tight">Settings</h1>
                    <p className="mt-2 text-zinc-400">Manage your profile and preferences.</p>
                </div>
                <SettingsForm user={user} />
            </div>
        </div>
    );
}
