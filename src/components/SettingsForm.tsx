'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/profile';
import Image from 'next/image';

export default function SettingsForm({ user }: { user: any }) {
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        async function getProfile() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    throw error;
                }

                if (data) {
                    setProfile(data);
                }
            } catch (error) {
                console.error('Error loading user data!', error);
            } finally {
                setLoading(false);
            }
        }

        getProfile();
    }, [user, supabase]);

    const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!profile) return;

        try {
            setLoading(true);
            setMessage(null);

            const updates = {
                id: user.id,
                username: profile.username,
                bio: profile.bio,
                favorite_weapon_id: profile.favorite_weapon_id,
                playstyle: profile.playstyle,
                default_stats: profile.default_stats,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Error updating profile!' });
            console.error('Error updating profile!', error);
        } finally {
            setLoading(false);
        }
    };

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setMessage(null);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            if (profile) {
                setProfile({ ...profile, avatar_url: data.publicUrl });

                // Auto-save the new avatar URL to the profile
                const { error: updateError } = await supabase.from('profiles').upsert({
                    id: user.id,
                    avatar_url: data.publicUrl,
                    updated_at: new Date().toISOString(),
                });

                if (updateError) throw updateError;
            }

            setMessage({ type: 'success', text: 'Avatar uploaded successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Error uploading avatar!' });
            console.error('Error uploading avatar!', error);
        } finally {
            setUploading(false);
        }
    };

    if (loading && !profile) {
        return <div className="text-center p-4">Loading profile...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-zinc-900 rounded-lg border border-zinc-800 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-amber-500">Tarnished Profile</h2>

            {message && (
                <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-900/50 text-green-200 border border-green-800' : 'bg-red-900/50 text-red-200 border border-red-800'}`}>
                    {message.text}
                </div>
            )}

            <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-700 bg-zinc-800 relative">
                        {profile?.avatar_url ? (
                            <Image
                                src={profile.avatar_url}
                                alt="Avatar"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl text-zinc-600">
                                ?
                            </div>
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-amber-600 hover:bg-amber-500 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors" htmlFor="avatar-upload">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                        </svg>
                    </label>
                    <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={uploadAvatar}
                        disabled={uploading}
                        className="hidden"
                    />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-semibold text-zinc-100">{profile?.username || 'Tarnished'}</h3>
                    <p className="text-zinc-400 text-sm mt-1">Update your personal details and stats.</p>
                </div>
            </div>

            <form onSubmit={updateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1" htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={profile?.username || ''}
                            onChange={(e) => setProfile({ ...profile!, username: e.target.value })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1" htmlFor="playstyle">Playstyle / Covenant</label>
                        <input
                            id="playstyle"
                            type="text"
                            value={profile?.playstyle || ''}
                            onChange={(e) => setProfile({ ...profile!, playstyle: e.target.value })}
                            placeholder="e.g. Strength Build, Sunbro"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1" htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        rows={3}
                        value={profile?.bio || ''}
                        onChange={(e) => setProfile({ ...profile!, bio: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1" htmlFor="favorite_weapon">Favorite Weapon ID</label>
                    <input
                        id="favorite_weapon"
                        type="text"
                        value={profile?.favorite_weapon_id || ''}
                        onChange={(e) => setProfile({ ...profile!, favorite_weapon_id: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                </div>

                <div className="border-t border-zinc-800 pt-6">
                    <h3 className="text-lg font-medium text-zinc-200 mb-4">Default Stats</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {['vigor', 'mind', 'endurance', 'strength', 'dexterity', 'intelligence', 'faith', 'arcane'].map((stat) => (
                            <div key={stat}>
                                <label className="block text-xs uppercase font-bold text-zinc-500 mb-1" htmlFor={`stat-${stat}`}>{stat.substring(0, 3)}</label>
                                <input
                                    id={`stat-${stat}`}
                                    type="number"
                                    min="0"
                                    max="99"
                                    value={profile?.default_stats?.[stat as keyof typeof profile.default_stats] || 0}
                                    onChange={(e) => setProfile({
                                        ...profile!,
                                        default_stats: {
                                            ...profile?.default_stats,
                                            [stat]: parseInt(e.target.value) || 0
                                        }
                                    })}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors text-center"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
