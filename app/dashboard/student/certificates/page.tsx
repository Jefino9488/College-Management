"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Award, Calendar, Eye } from "lucide-react";
import { ApiService } from "@/lib/api";
import { AuthService } from "@/lib/auth";
import { toast } from "sonner";

interface Certificate {
    id: string;
    courseName: string;
    issueDate: string;
    certificateUrl?: string;
}

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCertificates = async () => {
            try {
                const userId = AuthService.getUserId();
                if (!userId) {
                    toast.error("User not found", {
                        description: "Please log in again.",
                    });
                    setLoading(false);
                    return;
                }
                const certificatesData = await ApiService.getCertificates(userId);
                setCertificates(certificatesData);
            } catch (error: any) {
                console.error("Failed to load certificates:", error);
                toast.error("Failed to load certificates", {
                    description: error.message,
                });
            } finally {
                setLoading(false);
            }
        };
        loadCertificates();
    }, []);

    const getTypeIcon = () => <Award className="h-5 w-5" />;
    const getTypeColor = () => "bg-purple-100 text-purple-800";
    const getStatusColor = () => "default";

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-balance">My Certificates</h1>
                <p className="text-muted-foreground">
                    View and download your academic certificates and achievements
                </p>
            </div>
            <div className="grid gap-6">
                {certificates.map((certificate) => (
                    <Card key={certificate.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${getTypeColor()}`}>
                                        {getTypeIcon()}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">
                                            {certificate.courseName}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <Badge variant={getStatusColor() as any}>Issued</Badge>
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                    </Button>
                                    {certificate.certificateUrl && (
                                        <a
                                            href={certificate.certificateUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button size="sm">
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>
                    Issued: {new Date(certificate.issueDate).toLocaleDateString()}
                  </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {certificates.length === 0 && !loading && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                No Certificates Yet
                            </h3>
                            <p className="text-muted-foreground">
                                Your certificates and achievements will appear here once they
                                are issued.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}