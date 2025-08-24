import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Heart, 
  Users, 
  Activity, 
  Stethoscope, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  AlertTriangle,
  Clock,
  UserPlus,
  Bed
} from "lucide-react"

export default function HospitalDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Hospital Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <Button variant="outline" size="sm">
            Emergency Alerts
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Admit Patient
          </Button>
        </div>
      </div>
      <Separator />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12
              </span>
              admitted today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Beds</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -5
              </span>
              from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                98%
              </span>
              attendance rate
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">23</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -3
              </span>
              from last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Patient Flow</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Patient Flow Chart Component Would Go Here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Admissions</CardTitle>
            <CardDescription>
              Latest patient admissions today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/patient1.png" alt="Patient" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">John Davis</p>
                  <p className="text-sm text-muted-foreground">
                    Age 45 • Room 204
                  </p>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  <Badge className="bg-red-100 text-red-800">Critical</Badge>
                  <span className="text-xs text-muted-foreground">2h ago</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/patient2.png" alt="Patient" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Sarah Martinez</p>
                  <p className="text-sm text-muted-foreground">Age 32 • Room 156</p>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  <Badge className="bg-yellow-100 text-yellow-800">Stable</Badge>
                  <span className="text-xs text-muted-foreground">4h ago</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/patient3.png" alt="Patient" />
                  <AvatarFallback>RB</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Robert Brown</p>
                  <p className="text-sm text-muted-foreground">
                    Age 67 • Room 301
                  </p>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  <Badge className="bg-green-100 text-green-800">Good</Badge>
                  <span className="text-xs text-muted-foreground">6h ago</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/patient4.png" alt="Patient" />
                  <AvatarFallback>LW</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Lisa Wang</p>
                  <p className="text-xs text-muted-foreground">Age 28 • Room 189</p>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  <Badge className="bg-green-100 text-green-800">Recovering</Badge>
                  <span className="text-xs text-muted-foreground">8h ago</span>
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
            <CardTitle className="text-base">Department Occupancy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Emergency</span>
                <span className="text-sm text-muted-foreground">18/20</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ICU</span>
                <span className="text-sm text-muted-foreground">15/25</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">General Ward</span>
                <span className="text-sm text-muted-foreground">145/200</span>
              </div>
              <Progress value={72.5} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pediatrics</span>
                <span className="text-sm text-muted-foreground">22/30</span>
              </div>
              <Progress value={73.3} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Patient vitals critical</p>
                <p className="text-xs text-muted-foreground">Room 204 • John Davis</p>
                <p className="text-xs text-muted-foreground">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-orange-500 rounded-full" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Equipment maintenance due</p>
                <p className="text-xs text-muted-foreground">MRI Machine #3</p>
                <p className="text-xs text-muted-foreground">30 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-yellow-500 rounded-full" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Staff shortage alert</p>
                <p className="text-xs text-muted-foreground">Night shift - ICU</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Today&apos;s Schedule</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Surgery - Dr. Smith</p>
                  <p className="text-xs text-muted-foreground">10:00 AM - OR 3</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Cardiology Round</p>
                  <p className="text-xs text-muted-foreground">2:00 PM - Ward B</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Staff Meeting</p>
                  <p className="text-xs text-muted-foreground">4:00 PM - Conference Room</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}