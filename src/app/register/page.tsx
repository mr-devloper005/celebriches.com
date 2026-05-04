'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Bookmark, Eye, EyeOff, Github, Sparkles } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

function getRegisterConfig() {
  return {
    shell: 'bg-background text-foreground',
    panel: 'border border-border/80 bg-card shadow-[var(--shadow-card)]',
    side: 'border border-border/70 bg-muted/55',
    muted: 'text-muted-foreground',
    action: 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90',
    icon: Bookmark,
    title: 'Create your account',
    body: 'Join to start curating collections, saving resources, and building your personal library.',
  }
}

export default function RegisterPage() {
  const config = getRegisterConfig()
  const Icon = config.icon
  const { signup, isLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    purpose: '',
    agreeToTerms: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    purpose: '',
    agreeToTerms: ''
  })
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      purpose: '',
      agreeToTerms: ''
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }
    
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Please tell us what you want to create or publish'
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms'
    }
    
    setErrors(newErrors)
    return !newErrors.name && !newErrors.email && !newErrors.password && !newErrors.purpose && !newErrors.agreeToTerms
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      await signup(formData.name, formData.email, formData.password)
      toast({
        title: 'Account created!',
        description: 'Welcome! Your account has been successfully created.',
      })
      router.push('/')
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: 'Please check your information and try again.',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className={`min-h-screen ${config.shell}`}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className={`rounded-[2rem] p-8 ${config.side}`}>
            <Icon className="h-8 w-8" />
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em]">{config.title}</h1>
            <p className={`mt-5 text-sm leading-8 ${config.muted}`}>{config.body}</p>
            <div className="mt-8 grid gap-4">
              {['Different onboarding per product family', 'No repeated one-size-fits-all shell', 'Profile, publishing, and discovery aligned'].map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-current/10 px-4 py-4 text-sm">{item}</div>
              ))}
            </div>
          </div>

          <div className={`rounded-[2rem] p-8 ${config.panel}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Create account</p>
            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Full name</Label>
                <Input 
                  id="name"
                  name="name"
                  type="text" 
                  placeholder="Enter your full name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`h-12 rounded-xl border ${errors.name ? 'border-red-500' : 'border-current/10'} bg-transparent px-4 text-sm`}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Email address</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email" 
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`h-12 rounded-xl border ${errors.email ? 'border-red-500' : 'border-current/10'} bg-transparent px-4 text-sm`}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">Password</Label>
                <div className="relative">
                  <Input 
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password" 
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`h-12 rounded-xl border ${errors.password ? 'border-red-500' : 'border-current/10'} bg-transparent px-4 pr-12 text-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-current/50 hover:text-current transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-current/50">Must be at least 8 characters with uppercase, lowercase, and number</p>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="purpose" className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">What are you creating or publishing?</Label>
                <Input 
                  id="purpose"
                  name="purpose"
                  type="text" 
                  placeholder="e.g., articles, business listings, collections" 
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className={`h-12 rounded-xl border ${errors.purpose ? 'border-red-500' : 'border-current/10'} bg-transparent px-4 text-sm`}
                />
                {errors.purpose && <p className="text-xs text-red-500">{errors.purpose}</p>}
              </div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 rounded border-current/20 bg-transparent"
                />
                <Label htmlFor="agreeToTerms" className="text-sm font-normal cursor-pointer leading-5">
                  I agree to the <Link href="/terms" className="underline hover:text-current">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-current">Privacy Policy</Link>
                </Label>
              </div>
              {errors.agreeToTerms && <p className="text-xs text-red-500">{errors.agreeToTerms}</p>}
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold ${config.action} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
            <div className={`mt-6 flex items-center justify-between text-sm ${config.muted}`}>
              <span>Already have an account?</span>
              <Link href="/login" className="inline-flex items-center gap-2 font-semibold hover:underline">
                <Sparkles className="h-4 w-4" />
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
