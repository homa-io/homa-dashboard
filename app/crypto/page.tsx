import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Bitcoin, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  DollarSign,
  PieChart
} from "lucide-react"

export default function CryptoDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Crypto Portfolio</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <Button variant="outline" size="sm">
            <Minus className="h-4 w-4 mr-2" />
            Sell
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Buy
          </Button>
        </div>
      </div>
      <Separator />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$47,832.56</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.4%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Change</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+$2,345.67</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +5.15%
              </span>
              in 24 hours
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$35,000.00</div>
            <p className="text-xs text-muted-foreground">
              Initial investment
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+$12,832.56</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +36.7%
              </span>
              total return
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Portfolio Chart Component Would Go Here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Your Holdings</CardTitle>
            <CardDescription>
              Current cryptocurrency positions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="h-9 w-9 bg-orange-100 rounded-full flex items-center justify-center">
                  <Bitcoin className="h-5 w-5 text-orange-600" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Bitcoin</p>
                  <p className="text-sm text-muted-foreground">
                    0.75 BTC
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-medium">$28,450.25</p>
                  <p className="text-xs text-green-600 flex items-center justify-end">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +3.2%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="h-5 w-5 bg-blue-600 rounded-full" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Ethereum</p>
                  <p className="text-sm text-muted-foreground">8.42 ETH</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-medium">$12,680.40</p>
                  <p className="text-xs text-green-600 flex items-center justify-end">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +1.8%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-9 w-9 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-5 w-5 bg-green-600 rounded-full" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Cardano</p>
                  <p className="text-sm text-muted-foreground">
                    2,450 ADA
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-medium">$3,675.00</p>
                  <p className="text-xs text-red-600 flex items-center justify-end">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    -0.5%
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-9 w-9 bg-purple-100 rounded-full flex items-center justify-center">
                  <div className="h-5 w-5 bg-purple-600 rounded-full" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Solana</p>
                  <p className="text-sm text-muted-foreground">85.6 SOL</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-medium">$3,026.91</p>
                  <p className="text-xs text-green-600 flex items-center justify-end">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +7.2%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Asset Allocation</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-orange-500 rounded-full" />
                  <span className="text-sm font-medium">Bitcoin</span>
                </div>
                <span className="text-sm text-muted-foreground">59.5%</span>
              </div>
              <Progress value={59.5} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium">Ethereum</span>
                </div>
                <span className="text-sm text-muted-foreground">26.5%</span>
              </div>
              <Progress value={26.5} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">Cardano</span>
                </div>
                <span className="text-sm text-muted-foreground">7.7%</span>
              </div>
              <Progress value={7.7} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-purple-500 rounded-full" />
                  <span className="text-sm font-medium">Solana</span>
                </div>
                <span className="text-sm text-muted-foreground">6.3%</span>
              </div>
              <Progress value={6.3} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Plus className="h-4 w-4 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Bought BTC</p>
                <p className="text-xs text-muted-foreground">0.05 BTC • $1,850.00</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <Minus className="h-4 w-4 text-red-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Sold ETH</p>
                <p className="text-xs text-muted-foreground">2.5 ETH • $3,750.00</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Plus className="h-4 w-4 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Bought SOL</p>
                <p className="text-xs text-muted-foreground">25 SOL • $875.00</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Market Trends</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">BTC/USD</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">$37,934.33</p>
                <p className="text-xs text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +3.2%
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">ETH/USD</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">$1,506.72</p>
                <p className="text-xs text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +1.8%
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">ADA/USD</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">$0.3673</p>
                <p className="text-xs text-red-600 flex items-center">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  -0.5%
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">SOL/USD</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">$35.37</p>
                <p className="text-xs text-green-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +7.2%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}