"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import AuthGuard from "@/components/auth-guard"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ExternalLink, FileText, Loader2, Search } from "lucide-react"
import { certificateApi } from "@/lib/api";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { toast } from "sonner"
import {Certificate} from "@/lib/api";

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
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const itemsPerPage = 5

    useEffect(() => {
        const fetchCertificates = async () => {
            if (!user?.id) return;

            setIsLoading(true);
            try {
                const certificatesData = await certificateApi.getCertificates(user.id);
                setCertificates(certificatesData || []);
                toast.success("Certificates loaded successfully");
            } catch (error) {
                console.error("Error fetching certificates:", error);
                toast.error("Failed to load certificates. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCertificates();
    }, [user]);

    const filteredCertificates = certificates.filter(
        (cert) =>
            cert.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.id?.toString().includes(searchQuery)
    )

    // Sort certificates by issue date (assuming the backend provides an issueDate field)
    const sortedCertificates = [...filteredCertificates].sort(
        (a, b) => new Date(b.issueDate || b.createdAt).getTime() - new Date(a.issueDate || a.createdAt).getTime()
    )

    // Pagination
    const totalPages = Math.ceil(sortedCertificates.length / itemsPerPage)
    const paginatedCertificates = sortedCertificates.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

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
                                    <TableHead>Certificate ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Issue Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedCertificates.map((cert) => (
                                    <TableRow key={cert.id}>
                                        <TableCell className="font-medium">{cert.id}</TableCell>
                                        <TableCell>{cert.name || "Certificate"}</TableCell>
                                        <TableCell>
                                            {cert.issueDate
                                                ? new Date(cert.issueDate).toLocaleDateString()
                                                : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    cert.verified
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                                                }`}
                                            >
                                                {cert.verified ? "Verified" : "Pending"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {cert.url && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => window.open(cert.url, "_blank")}
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                    <span className="sr-only">View Certificate</span>
                                                </Button>
                                            )}
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