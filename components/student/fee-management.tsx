"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, DollarSign, CheckCircle, AlertTriangle } from "lucide-react"

interface FeeRecord {
  id: string
  semester: string
  academicYear: string
  totalAmount: number
  paidAmount: number
  dueAmount: number
  dueDate: string
  status: "paid" | "partial" | "overdue" | "pending"
  paymentHistory: PaymentHistory[]
}

interface PaymentHistory {
  id: string
  amount: number
  date: string
  method: string
  transactionId: string
}

export function FeeManagement() {
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadFeeData()
  }, [])

  const loadFeeData = async () => {
    try {
      // Mock data for demonstration
      setFeeRecords([
        {
          id: "1",
          semester: "Semester 1",
          academicYear: "2024",
          totalAmount: 15000,
          paidAmount: 15000,
          dueAmount: 0,
          dueDate: "2024-01-15",
          status: "paid",
          paymentHistory: [
            {
              id: "p1",
              amount: 15000,
              date: "2024-01-10",
              method: "Credit Card",
              transactionId: "TXN123456789",
            },
          ],
        },
        {
          id: "2",
          semester: "Semester 2",
          academicYear: "2024",
          totalAmount: 15000,
          paidAmount: 10000,
          dueAmount: 5000,
          dueDate: "2024-06-15",
          status: "partial",
          paymentHistory: [
            {
              id: "p2",
              amount: 10000,
              date: "2024-06-01",
              method: "Bank Transfer",
              transactionId: "TXN987654321",
            },
          ],
        },
        {
          id: "3",
          semester: "Semester 3",
          academicYear: "2024",
          totalAmount: 15000,
          paidAmount: 0,
          dueAmount: 15000,
          dueDate: "2024-12-15",
          status: "pending",
          paymentHistory: [],
        },
      ])
    } catch (err) {
      setError("Failed to load fee information")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "partial":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "partial":
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const totalFees = feeRecords.reduce((sum, record) => sum + record.totalAmount, 0)
  const totalPaid = feeRecords.reduce((sum, record) => sum + record.paidAmount, 0)
  const totalDue = feeRecords.reduce((sum, record) => sum + record.dueAmount, 0)

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Fee Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Fees</span>
            </div>
            <div className="text-2xl font-bold">${totalFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Academic year 2024</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Amount Paid</span>
            </div>
            <div className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{((totalPaid / totalFees) * 100).toFixed(1)}% completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Amount Due</span>
            </div>
            <div className="text-2xl font-bold text-red-600">${totalDue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Remaining balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Fee Records */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Payment Status</CardTitle>
          <CardDescription>Your semester-wise fee payment records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feeRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(record.status)}
                      <div>
                        <h3 className="font-semibold">
                          {record.semester} - {record.academicYear}
                        </h3>
                        <p className="text-sm text-muted-foreground">Due: {record.dueDate}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Payment Progress</span>
                      <span className="font-medium">
                        ${record.paidAmount.toLocaleString()} / ${record.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={(record.paidAmount / record.totalAmount) * 100} className="h-2" />

                    {record.dueAmount > 0 && (
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-red-600 font-medium">
                          Outstanding: ${record.dueAmount.toLocaleString()}
                        </span>
                        <Button size="sm">Pay Now</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>Your recent fee payments and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {feeRecords
              .flatMap((record) => record.paymentHistory)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">${payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{payment.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{payment.date}</p>
                    <p className="text-xs text-muted-foreground">{payment.transactionId}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
