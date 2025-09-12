"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Award, Calendar, FileText, Eye } from "lucide-react"
import { ApiService } from "@/lib/api"

interface Certificate {
  id: string
  title: string
  type: "degree" | "course" | "achievement" | "participation"
  issueDate: string
  validUntil?: string
  status: "active" | "expired" | "pending"
  description: string
  issuer: string
  downloadUrl?: string
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCertificates()
  }, [])

  const loadCertificates = async () => {
    try {
      // Get current user ID from auth context or localStorage
      const userId = localStorage.getItem("userId") || "current-user"
      const certificatesData = await ApiService.getCertificates(userId)
      setCertificates(certificatesData)
    } catch (error) {
      console.error("Failed to load certificates:", error)
      // Fallback to mock data
      setCertificates([
        {
          id: "1",
          title: "Bachelor of Computer Science",
          type: "degree",
          issueDate: "2024-05-15",
          status: "active",
          description: "Degree in Computer Science with specialization in Software Engineering",
          issuer: "University College of Technology",
          downloadUrl: "/certificates/degree-cs-2024.pdf",
        },
        {
          id: "2",
          title: "Data Structures and Algorithms",
          type: "course",
          issueDate: "2024-03-20",
          status: "active",
          description: "Completion certificate for advanced data structures course",
          issuer: "Computer Science Department",
          downloadUrl: "/certificates/course-dsa-2024.pdf",
        },
        {
          id: "3",
          title: "Dean's List Recognition",
          type: "achievement",
          issueDate: "2024-01-10",
          validUntil: "2024-12-31",
          status: "active",
          description: "Recognition for academic excellence in Fall 2023 semester",
          issuer: "Academic Affairs Office",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "degree":
        return <Award className="h-5 w-5" />
      case "course":
        return <FileText className="h-5 w-5" />
      case "achievement":
        return <Award className="h-5 w-5" />
      case "participation":
        return <Calendar className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "degree":
        return "bg-purple-100 text-purple-800"
      case "course":
        return "bg-blue-100 text-blue-800"
      case "achievement":
        return "bg-green-100 text-green-800"
      case "participation":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "expired":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userRole="student" currentPath="/dashboard/student/certificates" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-balance">My Certificates</h1>
            <p className="text-muted-foreground">View and download your academic certificates and achievements</p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{certificates.length}</div>
                <p className="text-xs text-muted-foreground">All time earned</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {certificates.filter((cert) => cert.status === "active").length}
                </div>
                <p className="text-xs text-muted-foreground">Currently valid</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Degrees</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{certificates.filter((cert) => cert.type === "degree").length}</div>
                <p className="text-xs text-muted-foreground">Academic degrees</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {certificates.filter((cert) => cert.type === "achievement").length}
                </div>
                <p className="text-xs text-muted-foreground">Special recognitions</p>
              </CardContent>
            </Card>
          </div>

          {/* Certificates List */}
          <div className="grid gap-6">
            {certificates.map((certificate) => (
              <Card key={certificate.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(certificate.type)}`}>
                        {getTypeIcon(certificate.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{certificate.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span>{certificate.issuer}</span>
                          <Badge variant={getStatusColor(certificate.status) as any}>{certificate.status}</Badge>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {certificate.downloadUrl && (
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{certificate.description}</p>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
                    </div>
                    {certificate.validUntil && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Valid until: {new Date(certificate.validUntil).toLocaleDateString()}</span>
                      </div>
                    )}
                    <Badge variant="outline" className="capitalize">
                      {certificate.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {certificates.length === 0 && !loading && (
              <Card>
                <CardContent className="text-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
                  <p className="text-muted-foreground">
                    Your certificates and achievements will appear here once they are issued.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
