import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Mail,
  Building,
  Star,
  Clock
} from "lucide-react"

export default function CRMDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">CRM Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <Button variant="outline" size="sm">
            Export Contacts
          </Button>
        </div>
      </div>
      <Separator />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.8%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2%
              </span>
              this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deal Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$284,567</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +18.7%
              </span>
              in pipeline
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Close Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.4%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -1.2%
              </span>
              from last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Pipeline Chart Component Would Go Here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Contacts</CardTitle>
            <CardDescription>
              Latest additions to your CRM.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/jennifer.png" alt="Avatar" />
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Jennifer Lopez</p>
                  <p className="text-sm text-muted-foreground">
                    <Building className="h-3 w-3 inline mr-1" />
                    Tech Solutions Inc.
                  </p>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Badge>Hot Lead</Badge>
                </div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/robert.png" alt="Avatar" />
                  <AvatarFallback>RB</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Robert Brown</p>
                  <p className="text-sm text-muted-foreground">
                    <Building className="h-3 w-3 inline mr-1" />
                    Global Marketing Ltd.
                  </p>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Badge variant="outline">Qualified</Badge>
                </div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/lisa.png" alt="Avatar" />
                  <AvatarFallback>LW</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Lisa Wang</p>
                  <p className="text-sm text-muted-foreground">
                    <Building className="h-3 w-3 inline mr-1" />
                    Digital Dynamics
                  </p>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Badge variant="secondary">Cold Lead</Badge>
                </div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/david.png" alt="Avatar" />
                  <AvatarFallback>DC</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">David Chen</p>
                  <p className="text-sm text-muted-foreground">
                    <Building className="h-3 w-3 inline mr-1" />
                    Innovation Corp
                  </p>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Badge>Prospect</Badge>
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
            <CardTitle className="text-base">Lead Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Website</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Referrals</span>
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
                <span className="text-sm font-medium">Cold Calls</span>
                <span className="text-sm text-muted-foreground">9%</span>
              </div>
              <Progress value={9} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Today&apos;s Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-blue-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Follow up with TechCorp</p>
                <p className="text-xs text-muted-foreground">Due in 2 hours</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-green-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Send proposal to StartupX</p>
                <p className="text-xs text-muted-foreground">Due today</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-orange-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Demo with Enterprise Co.</p>
                <p className="text-xs text-muted-foreground">3:00 PM today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Customer Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9</div>
            <p className="text-xs text-muted-foreground mb-4">Average rating from 1,234 reviews</p>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}