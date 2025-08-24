import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  File, 
  Folder, 
  HardDrive, 
  Upload, 
  Calendar,
  Download,
  Search,
  Filter,
  MoreVertical,
  FileText,
  Image,
  Video,
  Music,
  Archive
} from "lucide-react"

export default function FileManagerDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">File Manager</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>
      <Separator />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              +142 files this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128.4 GB</div>
            <p className="text-xs text-muted-foreground">
              of 500 GB available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shared Files</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">453</div>
            <p className="text-xs text-muted-foreground">
              with team members
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads Today</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              +12% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Files</CardTitle>
              <CardDescription>Your recently accessed files</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 rounded-lg border">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Project_Proposal_Final.pdf</p>
                  <p className="text-xs text-muted-foreground">Modified 2 hours ago • 2.4 MB</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 p-3 rounded-lg border">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Image className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Dashboard_Screenshots.zip</p>
                  <p className="text-xs text-muted-foreground">Modified yesterday • 15.7 MB</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 p-3 rounded-lg border">
                <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Video className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Team_Meeting_Recording.mp4</p>
                  <p className="text-xs text-muted-foreground">Modified 2 days ago • 124.8 MB</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 p-3 rounded-lg border">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Archive className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Website_Assets.zip</p>
                  <p className="text-xs text-muted-foreground">Modified 3 days ago • 45.2 MB</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Storage Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Storage</span>
                  <span className="text-sm text-muted-foreground">128.4 GB / 500 GB</span>
                </div>
                <Progress value={25.68} className="h-2" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-blue-500 rounded-full" />
                    <span className="text-sm">Documents</span>
                  </div>
                  <span className="text-sm font-medium">45.2 GB</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full" />
                    <span className="text-sm">Images</span>
                  </div>
                  <span className="text-sm font-medium">32.8 GB</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-red-500 rounded-full" />
                    <span className="text-sm">Videos</span>
                  </div>
                  <span className="text-sm font-medium">28.6 GB</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-yellow-500 rounded-full" />
                    <span className="text-sm">Audio</span>
                  </div>
                  <span className="text-sm font-medium">12.4 GB</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-gray-500 rounded-full" />
                    <span className="text-sm">Other</span>
                  </div>
                  <span className="text-sm font-medium">9.4 GB</span>
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
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-auto flex-col space-y-2 p-4">
                <Folder className="h-6 w-6" />
                <span className="text-xs">New Folder</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col space-y-2 p-4">
                <Upload className="h-6 w-6" />
                <span className="text-xs">Upload File</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col space-y-2 p-4">
                <Download className="h-6 w-6" />
                <span className="text-xs">Download All</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col space-y-2 p-4">
                <Search className="h-6 w-6" />
                <span className="text-xs">Advanced Search</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">File Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Documents</span>
                </div>
                <Badge variant="outline">1,234</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Image className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Images</span>
                </div>
                <Badge variant="outline">856</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Video className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Videos</span>
                </div>
                <Badge variant="outline">123</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Music className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Audio</span>
                </div>
                <Badge variant="outline">67</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">File uploaded</p>
                  <p className="text-xs text-muted-foreground">design_assets.zip</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">File shared</p>
                  <p className="text-xs text-muted-foreground">project_report.pdf</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Folder created</p>
                  <p className="text-xs text-muted-foreground">Q4 Reports</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}