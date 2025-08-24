import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Clock, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  CheckCircle,
  Star,
  GraduationCap,
  Target
} from "lucide-react"

export default function AcademyDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Academy Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <Button size="sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Browse Courses
          </Button>
        </div>
      </div>
      <Separator />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +3
              </span>
              this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47h</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12h
              </span>
              this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +1
              </span>
              earned this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Progress Chart Component Would Go Here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Current Courses</CardTitle>
            <CardDescription>
              Your active learning paths.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-800">Frontend</Badge>
                    <p className="text-sm font-medium">React Advanced Patterns</p>
                  </div>
                  <span className="text-xs text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-2" />
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/avatars/instructor1.png" />
                    <AvatarFallback className="text-xs">JD</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">John Doe • 2h left</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">Backend</Badge>
                    <p className="text-sm font-medium">Node.js Masterclass</p>
                  </div>
                  <span className="text-xs text-muted-foreground">60%</span>
                </div>
                <Progress value={60} className="h-2" />
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/avatars/instructor2.png" />
                    <AvatarFallback className="text-xs">SM</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">Sarah Miller • 8h left</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-100 text-purple-800">Design</Badge>
                    <p className="text-sm font-medium">UI/UX Principles</p>
                  </div>
                  <span className="text-xs text-muted-foreground">30%</span>
                </div>
                <Progress value={30} className="h-2" />
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/avatars/instructor3.png" />
                    <AvatarFallback className="text-xs">AK</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">Alex Kim • 15h left</span>
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
            <CardTitle className="text-base">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Completed: &quot;React Hooks&quot;</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Play className="h-4 w-4 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Started: &quot;Advanced TypeScript&quot;</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Trophy className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Earned Certificate: &quot;CSS Grid&quot;</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Achievements</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center space-y-2">
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="text-xs font-medium">Fast Learner</p>
                <Badge variant="secondary" className="text-xs">Unlocked</Badge>
              </div>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-xs font-medium">Goal Achiever</p>
                <Badge variant="secondary" className="text-xs">Unlocked</Badge>
              </div>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-xs font-medium">Top Student</p>
                <Badge variant="outline" className="text-xs">Progress: 80%</Badge>
              </div>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-xs font-medium">Community Helper</p>
                <Badge variant="outline" className="text-xs">Progress: 45%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Recommended</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">JavaScript ES2023</p>
                  <p className="text-xs text-muted-foreground">Latest features and updates</p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">4.9 • 12h</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Docker Fundamentals</p>
                  <p className="text-xs text-muted-foreground">Containerization basics</p>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">4.8 • 8h</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}