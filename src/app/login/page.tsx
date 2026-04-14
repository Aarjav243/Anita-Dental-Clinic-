'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Assistant Login</CardTitle>
          <CardDescription>
            Dr. Anita Mankottill Dental Clinic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          >
            Sign in with Google
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Only authorised clinic staff can access this area.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
