'use client'

import React from 'react'
import {
  BookOpen,
  Clock,
  Award,
  Users,
  ChevronRight,
} from 'lucide-react'

import { Button } from '@/components/custom/Button'
import {
  Card,
  CardHeader,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface Course {
  id: number
  title: string
  instructor: string
  progress: number
  duration: string
  students: number
  category: string
}

export default function Homepage() {
  const courses: Course[] = [
    {
      id: 1,
      title: 'Introduction to Quran',
      instructor: 'Sheikh Ahmad',
      progress: 75,
      duration: '8 weeks',
      students: 120,
      category: 'Quran Studies',
    },
    {
      id: 2,
      title: 'Hadith Sciences',
      instructor: 'Dr. Fatima Al-Zahra',
      progress: 45,
      duration: '12 weeks',
      students: 89,
      category: 'Hadith',
    },
    {
      id: 3,
      title: 'Islamic Jurisprudence',
      instructor: 'Sheikh Omar',
      progress: 60,
      duration: '16 weeks',
      students: 67,
      category: 'Fiqh',
    },
    {
      id: 4,
      title: 'Arabic Grammar',
      instructor: 'Ustadh Yusuf',
      progress: 30,
      duration: '10 weeks',
      students: 95,
      category: 'Language',
    },
    {
      id: 5,
      title: 'Islamic History',
      instructor: 'Dr. Amina Hassan',
      progress: 85,
      duration: '6 weeks',
      students: 134,
      category: 'History',
    },
    {
      id: 6,
      title: 'Tafsir Al-Quran',
      instructor: 'Sheikh Abdullah',
      progress: 20,
      duration: '20 weeks',
      students: 78,
      category: 'Quran Studies',
    },
  ]

  const stats = [
    {
      title: 'Total Courses',
      value: '24',
      description: 'Active learning paths',
      icon: BookOpen,
    },
    {
      title: 'Study Hours',
      value: '156',
      description: 'This month',
      icon: Clock,
    },
    {
      title: 'Certificates',
      value: '8',
      description: 'Completed courses',
      icon: Award,
    },
    {
      title: 'Community',
      value: '2.1k',
      description: 'Fellow students',
      icon: Users,
    },
  ]

  return (
    <>
      {/* Dashboard Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Welcome back, Student! 👋
            </h2>
            <p className="text-muted-foreground mt-1">
              Continue your Islamic learning journey
            </p>
          </div>
          <Button color="pink" className="scale-90">
            <Button.Icon><Award className="w-4 h-4" /></Button.Icon>
            <Button.Label>Certificates</Button.Label>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Icon className="w-8 h-8 text-primary" />
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">
            My Courses
          </h3>
          <Button color="cyan" className="scale-90">
            <Button.Label>All Courses</Button.Label>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-32 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-green-600" />
              </div>

              <CardContent>
                <Badge variant="secondary">{course.category}</Badge>
                <h4 className="text-base font-semibold text-foreground mt-1 mb-2">
                  {course.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {course.instructor}
                </p>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress
                      value={course.progress}
                      className="h-2 rounded-full"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{course.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{course.students} students</span>
                    </span>
                  </div>
                </div>

                <Button color="cyan" className="w-full mt-4 scale-90 origin-left">
                  <Button.Label>Continue</Button.Label>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}