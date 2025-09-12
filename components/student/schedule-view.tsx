"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Clock, MapPin, BookOpen } from "lucide-react"
import { format, isToday, isTomorrow } from "date-fns"

interface ScheduleItem {
  id: string
  subject: string
  subjectCode: string
  type: "lecture" | "lab" | "exam" | "assignment"
  date: string
  startTime: string
  endTime: string
  room: string
  instructor: string
}

export function ScheduleView() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSchedule()
  }, [])

  const loadSchedule = async () => {
    try {
      // Mock data for demonstration
      setScheduleItems([
        {
          id: "1",
          subject: "Data Structures",
          subjectCode: "CS301",
          type: "lecture",
          date: "2024-01-15",
          startTime: "09:00",
          endTime: "10:30",
          room: "Room 101",
          instructor: "Dr. Johnson",
        },
        {
          id: "2",
          subject: "Database Systems",
          subjectCode: "CS302",
          type: "lab",
          date: "2024-01-15",
          startTime: "11:00",
          endTime: "12:30",
          room: "Lab 205",
          instructor: "Prof. Smith",
        },
        {
          id: "3",
          subject: "Computer Networks",
          subjectCode: "CS303",
          type: "lecture",
          date: "2024-01-16",
          startTime: "14:00",
          endTime: "15:30",
          room: "Room 301",
          instructor: "Dr. Davis",
        },
        {
          id: "4",
          subject: "Software Engineering",
          subjectCode: "CS304",
          type: "exam",
          date: "2024-01-18",
          startTime: "10:00",
          endTime: "13:00",
          room: "Exam Hall A",
          instructor: "Dr. Wilson",
        },
        {
          id: "5",
          subject: "Database Systems",
          subjectCode: "CS302",
          type: "assignment",
          date: "2024-01-20",
          startTime: "23:59",
          endTime: "23:59",
          room: "Online",
          instructor: "Prof. Smith",
        },
      ])
    } catch (error) {
      console.error("Failed to load schedule:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lecture":
        return "bg-blue-100 text-blue-800"
      case "lab":
        return "bg-green-100 text-green-800"
      case "exam":
        return "bg-red-100 text-red-800"
      case "assignment":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lecture":
        return <BookOpen className="h-4 w-4" />
      case "lab":
        return <BookOpen className="h-4 w-4" />
      case "exam":
        return <CalendarIcon className="h-4 w-4" />
      case "assignment":
        return <Clock className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getDateLabel = (date: string) => {
    const itemDate = new Date(date)
    if (isToday(itemDate)) return "Today"
    if (isTomorrow(itemDate)) return "Tomorrow"
    return format(itemDate, "MMM dd, yyyy")
  }

  const todaySchedule = scheduleItems.filter((item) => isToday(new Date(item.date)))
  const upcomingSchedule = scheduleItems.filter((item) => new Date(item.date) > new Date())

  return (
    <div className="space-y-6">
      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
          <CardDescription>{format(new Date(), "EEEE, MMMM dd, yyyy")}</CardDescription>
        </CardHeader>
        <CardContent>
          {todaySchedule.length > 0 ? (
            <div className="space-y-3">
              {todaySchedule.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(item.type)}
                        <div>
                          <h3 className="font-semibold">{item.subject}</h3>
                          <p className="text-sm text-muted-foreground">{item.subjectCode}</p>
                        </div>
                      </div>
                      <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                    </div>

                    <div className="grid gap-2 md:grid-cols-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {item.startTime} - {item.endTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {item.room}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {item.instructor}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No classes scheduled for today</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Schedule</CardTitle>
          <CardDescription>Your classes, exams, and assignments for the coming days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingSchedule.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(item.type)}
                      <div>
                        <h3 className="font-semibold">{item.subject}</h3>
                        <p className="text-sm text-muted-foreground">{item.subjectCode}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                      <p className="text-sm text-muted-foreground mt-1">{getDateLabel(item.date)}</p>
                    </div>
                  </div>

                  <div className="grid gap-2 md:grid-cols-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {item.type === "assignment" ? `Due: ${item.startTime}` : `${item.startTime} - ${item.endTime}`}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {item.room}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {item.instructor}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
          <CardDescription>Navigate through your academic calendar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
