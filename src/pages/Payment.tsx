import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Wallet, CreditCard, Building2, Smartphone, Plus, Eye, EyeOff, Download, Volume2, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  type: 'bank' | 'upi';
  name: string;
  details: string;
  isDefault: boolean;
  isVerified: boolean;
}

interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal';
  amount: number;
  description: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  jobTitle?: string;
  company?: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'bank',
      name: 'State Bank of India',
      details: '****1234',
      isDefault: true,
      isVerified: true,
    },
    {
      id: '2',
      type: 'upi',
      name: 'PhonePe',
      details: 'user@phonepe',
      isDefault: false,
      isVerified: true,
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'earning',
      amount: 850,
      description: 'Payment for delivery work',
      date: new Date(Date.now() - 86400000),
      status: 'completed',
      jobTitle: 'Food Delivery',
      company: 'QuickEats',
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: 500,
      description: 'Withdrawal to bank account',
      date: new Date(Date.now() - 172800000),
      status: 'completed',
    },
    {
      id: '3',
      type: 'earning',
      amount: 1200,
      description: 'Payment for cleaning work',
      date: new Date(Date.now() - 259200000),
      status: 'completed',
      jobTitle: 'Office Cleaning',
      company: 'CleanCorp',
    },
    {
      id: '4',
      type: 'withdrawal',
      amount: 1000,
      description: 'Withdrawal to UPI',
      date: new Date(Date.now() - 345600000),
      status: 'pending',
    },
  ]);

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'bank' as 'bank' | 'upi',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    upiId: '',
  });

  const totalEarnings = transactions
    .filter(t => t.type === 'earning' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingPayments = transactions
    .filter(t => t.type === 'earning' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const availableBalance = totalEarnings - transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const addPaymentMethod = () => {
    if (newPaymentMethod.type === 'bank') {
      if (!newPaymentMethod.bankName || !newPaymentMethod.accountNumber || !newPaymentMethod.ifscCode || !newPaymentMethod.accountHolderName) {
        toast.error("Please fill all bank details");
        return;
      }
    } else {
      if (!newPaymentMethod.upiId) {
        toast.error("Please enter UPI ID");
        return;
      }
    }

    const paymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: newPaymentMethod.type,
      name: newPaymentMethod.type === 'bank' ? newPaymentMethod.bankName : 'UPI',
      details: newPaymentMethod.type === 'bank' 
        ? `****${newPaymentMethod.accountNumber.slice(-4)}`
        : newPaymentMethod.upiId,
      isDefault: paymentMethods.length === 0,
      isVerified: false,
    };

    setPaymentMethods(prev => [...prev, paymentMethod]);
    setNewPaymentMethod({
      type: 'bank',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      upiId: '',
    });
    setShowAddPayment(false);
    toast.success("Payment method added successfully");
    
    if (isSupported) {
      speak("Payment method added successfully");
    }
  };

  const withdrawMoney = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: 'withdrawal',
      amount,
      description: 'Withdrawal request',
      date: new Date(),
      status: 'pending',
    };

    setTransactions(prev => [transaction, ...prev]);
    setWithdrawAmount('');
    setSelectedPaymentMethod('');
    toast.success("Withdrawal request submitted");
    
    if (isSupported) {
      speak(`Withdrawal request for ${formatCurrency(amount)} submitted successfully`);
    }
  };

  const readEarnings = () => {
    if (isSupported) {
      const message = `Your total earnings are ${formatCurrency(totalEarnings)}. Available balance is ${formatCurrency(availableBalance)}. You have ${pendingPayments > 0 ? formatCurrency(pendingPayments) + ' in pending payments' : 'no pending payments'}.`;
      speak(message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={() => navigate('/worker/profile')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Payment & Earnings</h1>
            <p className="text-white/80">Manage your earnings and payments</p>
          </div>
        </div>

        {isSupported && (
          <Button
            onClick={readEarnings}
            variant="secondary"
            size="sm"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Read Earnings
          </Button>
        )}
      </div>

      <div className="px-6 -mt-4 pb-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-success/10 rounded-full">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                      <p className="text-2xl font-bold text-success">
                        {formatCurrency(totalEarnings)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Balance</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(availableBalance)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-medium">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-warning/10 rounded-full">
                      <Clock className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-warning">
                        {formatCurrency(pendingPayments)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Withdraw */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Quick Withdraw</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount"
                      max={availableBalance}
                    />
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.filter(pm => pm.isVerified).map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            {method.name} - {method.details}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={withdrawMoney}
                  disabled={!withdrawAmount || !selectedPaymentMethod || parseFloat(withdrawAmount) > availableBalance}
                  className="w-full"
                >
                  Withdraw {withdrawAmount && formatCurrency(parseFloat(withdrawAmount))}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'earning' ? 'bg-success/10' : 'bg-primary/10'
                        }`}>
                          {transaction.type === 'earning' ? (
                            <TrendingUp className="w-4 h-4 text-success" />
                          ) : (
                            <Wallet className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'earning' ? 'text-success' : 'text-primary'
                        }`}>
                          {transaction.type === 'earning' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <Badge variant={
                          transaction.status === 'completed' ? 'default' : 
                          transaction.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Payment Methods
                  <Button
                    onClick={() => setShowAddPayment(true)}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Method
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded-full">
                        {method.type === 'bank' ? (
                          <Building2 className="w-5 h-5" />
                        ) : (
                          <Smartphone className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.details}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                      {method.isVerified ? (
                        <Badge variant="default" className="bg-success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </div>
                  </div>
                ))}

                {showAddPayment && (
                  <Card className="border-primary/20">
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <Label>Payment Method Type</Label>
                        <Select
                          value={newPaymentMethod.type}
                          onValueChange={(value: 'bank' | 'upi') => 
                            setNewPaymentMethod(prev => ({ ...prev, type: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank">Bank Account</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {newPaymentMethod.type === 'bank' ? (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Bank Name</Label>
                              <Input
                                value={newPaymentMethod.bankName}
                                onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, bankName: e.target.value }))}
                                placeholder="e.g. State Bank of India"
                              />
                            </div>
                            <div>
                              <Label>Account Holder Name</Label>
                              <Input
                                value={newPaymentMethod.accountHolderName}
                                onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, accountHolderName: e.target.value }))}
                                placeholder="Full name as per bank"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Account Number</Label>
                              <div className="relative">
                                <Input
                                  type={showAccountDetails ? "text" : "password"}
                                  value={newPaymentMethod.accountNumber}
                                  onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, accountNumber: e.target.value }))}
                                  placeholder="Account number"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                  onClick={() => setShowAccountDetails(!showAccountDetails)}
                                >
                                  {showAccountDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label>IFSC Code</Label>
                              <Input
                                value={newPaymentMethod.ifscCode}
                                onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                                placeholder="e.g. SBIN0001234"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div>
                          <Label>UPI ID</Label>
                          <Input
                            value={newPaymentMethod.upiId}
                            onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, upiId: e.target.value }))}
                            placeholder="e.g. user@phonepe"
                          />
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button onClick={addPaymentMethod} size="sm">
                          Add Payment Method
                        </Button>
                        <Button
                          onClick={() => setShowAddPayment(false)}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Transaction History
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'earning' ? 'bg-success/10' : 'bg-primary/10'
                        }`}>
                          {transaction.type === 'earning' ? (
                            <TrendingUp className="w-4 h-4 text-success" />
                          ) : (
                            <Wallet className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          {transaction.jobTitle && (
                            <p className="text-sm text-muted-foreground">
                              {transaction.jobTitle} • {transaction.company}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {transaction.date.toLocaleDateString()} at {transaction.date.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'earning' ? 'text-success' : 'text-primary'
                        }`}>
                          {transaction.type === 'earning' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <Badge variant={
                          transaction.status === 'completed' ? 'default' : 
                          transaction.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Payment;