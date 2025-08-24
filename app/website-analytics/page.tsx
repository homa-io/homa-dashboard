import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Eye, 
  Users, 
  TrendingUp, 
  Clock, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Smartphone,
  Monitor,
  MousePointer
} from "lucide-react"

export default function WebsiteAnalyticsDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Website Analytics</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
      </div>
      <Separator />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,563</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +14.2%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +9.8%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89,432</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +21.5%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3m 42s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -12s
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Traffic Chart Component Would Go Here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>
              Most visited pages this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="h-9 w-9 bg-blue-100 rounded-md flex items-center justify-center">
                  <Globe className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">/home</p>
                  <p className="text-sm text-muted-foreground">
                    Landing page
                  </p>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  <p className="font-medium">12,456</p>
                  <Badge variant="outline">45.2%</Badge>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-9 w-9 bg-green-100 rounded-md flex items-center justify-center">
                  <Globe className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">/products</p>
                  <p className="text-sm text-muted-foreground">Product catalog</p>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  <p className="font-medium">8,234</p>
                  <Badge variant="outline">29.8%</Badge>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-9 w-9 bg-yellow-100 rounded-md flex items-center justify-center">
                  <Globe className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">/about</p>
                  <p className="text-sm text-muted-foreground">
                    About us page
                  </p>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  <p className="font-medium">4,567</p>
                  <Badge variant="outline">16.5%</Badge>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-9 w-9 bg-purple-100 rounded-md flex items-center justify-center">
                  <Globe className="h-4 w-4 text-purple-600" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">/contact</p>
                  <p className="text-sm text-muted-foreground">Contact form</p>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  <p className="font-medium">2,341</p>
                  <Badge variant="outline">8.5%</Badge>
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
            <CardTitle className="text-base">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Organic Search</span>
                <span className="text-sm text-muted-foreground">42%</span>
              </div>
              <Progress value={42} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Direct</span>
                <span className="text-sm text-muted-foreground">28%</span>
              </div>
              <Progress value={28} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Social Media</span>
                <span className="text-sm text-muted-foreground">18%</span>
              </div>
              <Progress value={18} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Referral</span>
                <span className="text-sm text-muted-foreground">12%</span>
              </div>
              <Progress value={12} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Desktop</span>
              </div>
              <span className="text-sm font-medium">58%</span>
            </div>
            <Progress value={58} className="h-2" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Mobile</span>
              </div>
              <span className="text-sm font-medium">35%</span>
            </div>
            <Progress value={35} className="h-2" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Tablet</span>
              </div>
              <span className="text-sm font-medium">7%</span>
            </div>
            <Progress value={7} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Bounce Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34.2%</div>
            <p className="text-xs text-muted-foreground mb-4">
              <span className="text-green-600 flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -2.3%
              </span>
              improvement from last month
            </p>
            <Progress value={66} className="h-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}