'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useProfileQuery, useUpdateProfileMutation } from '@/services';
import { ThemeToggle } from '@/components/custom/ThemeToggle';
import { Button } from '@/components/custom/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { data: user, isLoading, isError } = useProfileQuery();
  const [name, setName] = useState('');
  const updateProfileMutation = useUpdateProfileMutation({
    onSuccess: () => {
      toast.success('Profile updated');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfileMutation.mutate({ name });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the application.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                Select your preferred theme.
              </p>
            </div>
            <ThemeToggle />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading profile...</div>
            ) : isError ? (
              <div className="text-sm text-destructive">Failed to load profile.</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your username"
                />
              </div>
              <Button type="submit" color="cyan" isLoading={updateProfileMutation.isPending}>
                <Button.Spinner />
                <Button.Label>Save Changes</Button.Label>
              </Button>
            </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
