"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import AuthGuard from "@/components/auth-guard"
import Navigation from "@/components/navigation"
import { certificatesApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ExternalLink, FileText, Loader2, Search } from "lucide-react"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function CertificatesPage() {
    return (
        <AuthGuard allowedRoles={["STUDENT"]}>
            <div className="flex min-h-screen flex-col">
                <Navigation />
                <div className="flex-1 p-4 md:p-8">
                    <CertificatesContent />
                </div>
            </div>
        </AuthGuard>
    )
}

function CertificatesContent() {
    const { user } = useAuth()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [certificates, setCertificates] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    useEffect(() => {
        const fetchCertificates = async () => {
            setIsLoading(true)
            try {
                const response = await certificatesApi.getCertificates()
                setCertificates(response.data || [])
            } catch (error) {
                console.error("Error fetching certificates:", error)
                toast({
                    title: "Error",
                    description: "Failed to load certificates. Please try again.",
                    variant: "destructive",
                })

                // For demo purposes, set some sample data
                const sampleCertificates = []
                const courseNames = [
                    "Introduction to Programming",
                    "Data Structures and Algorithms",
                    "Web Development Fundamentals",
                    "Database Management Systems",
                    "Machine Learning Basics",
                    "Cloud Computing",
                    "Cybersecurity Essentials",
                    "Mobile App Development",
                    "Software Engineering Principles",
                    "Artificial Intelligence",
                    "Computer Networks",
                    "Operating Systems",
                ]

                const platforms = [
                    "Coursera",
                    "edX",
                    "Udemy",
                    "Codecademy",
                    "LinkedIn Learning",
                    "Khan Academy",
                    "FreeCodeCamp",
                ]

                for (let i = 1; i <= 12; i++) {
                    const issueDate = new Date()
                    issueDate.setMonth(issueDate.getMonth() - Math.floor(Math.random() * 12))

                    sampleCertificates.push({
                        id: `cert-${i}`,
                        courseName: courseNames[i - 1],
                        platform: platforms[Math.floor(Math.random() * platforms.length)],
                        issueDate: issueDate.toISOString(),
                        expiryDate: null,
                        url: "https://example.com/certificate",
                        verified: Math.random() > 0.3,
                    })
                }

                setCertificates(sampleCertificates)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCertificates()
    }, [toast])

    const filteredCertificates = certificates.filter(
        (cert) =>
            cert.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.platform.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Sort certificates by issue date (newest first)
    const sortedCertificates = [...filteredCertificates].sort(
        (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime(),
    )

    // Pagination
    const totalPages = Math.ceil(sortedCertificates.length / itemsPerPage)
    const paginatedCertificates = sortedCertificates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
                <div className="relative flex-1 sm:max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search certificates..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : paginatedCertificates.length > 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Certificate List</CardTitle>
                        <CardDescription>View and manage your certificates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course Name</TableHead>
                                    <TableHead>Platform</TableHead>
                                    <TableHead>Issue Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedCertificates.map((cert) => (
                                    <TableRow key={cert.id}>
                                        <TableCell className="font-medium">{cert.courseName}</TableCell>
                                        <TableCell>{cert.platform}</TableCell>
                                        <TableCell>{new Date(cert.issueDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                      <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              cert.verified
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }`}
                      >
                        {cert.verified ? "Verified" : "Pending Verification"}
                      </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => window.open(cert.url, "_blank")}>
                                                <ExternalLink className="h-4 w-4" />
                                                <span className="sr-only">View Certificate</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {totalPages > 1 && (
                            <Pagination className="mt-6">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const pageNumber = i + 1
                                        return (
                                            <PaginationItem key={pageNumber}>
                                                <PaginationLink
                                                    onClick={() => setCurrentPage(pageNumber)}
                                                    isActive={currentPage === pageNumber}
                                                >
                                                    {pageNumber}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    })}

                                    {totalPages > 5 && (
                                        <>
                                            <PaginationItem>
                                                <span className="px-2">...</span>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink
                                                    onClick={() => setCurrentPage(totalPages)}
                                                    isActive={currentPage === totalPages}
                                                >
                                                    {totalPages}
                                                </PaginationLink>
                                            </PaginationItem>
                                        </>
                                    )}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="flex h-64 flex-col items-center justify-center gap-4">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                        <div className="text-center">
                            <h3 className="text-lg font-medium">No Certificates Found</h3>
                            <p className="text-sm text-muted-foreground">
                                {searchQuery ? "No certificates match your search criteria." : "You don't have any certificates yet."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

