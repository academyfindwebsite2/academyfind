"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Briefcase, Trophy, Zap, Plus, Trash2 } from "lucide-react";
import { addEducation, deleteEducation, addExperience, deleteExperience, addAchievement, deleteAchievement, addSkill, deleteSkill } from "@/lib/profile/actions/portfolio";
import toast from "react-hot-toast";

function Empty({ text }: { text: string }) {
  return (
    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-slate-500">
      <p className="text-sm">{text}</p>
    </div>
  );
}

export function PortfolioTab({ profile, isOwnProfile }: { profile: any; isOwnProfile: boolean }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <EducationSection profile={profile} isOwnProfile={isOwnProfile} />
      <ExperienceSection profile={profile} isOwnProfile={isOwnProfile} />
      <AchievementsSection profile={profile} isOwnProfile={isOwnProfile} />
      <SkillsSection profile={profile} isOwnProfile={isOwnProfile} />
    </div>
  );
}

// =======================
// EDUCATION
// =======================
function EducationSection({ profile, isOwnProfile }: { profile: any; isOwnProfile: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addEducation({
        type: formData.get("type") as "SCHOOL" | "COLLEGE",
        institutionName: formData.get("institutionName") as string,
        courseOrClass: formData.get("courseOrClass") as string,
        score: formData.get("score") as string || undefined,
        startDate: formData.get("startDate") ? new Date(formData.get("startDate") as string) : undefined,
        endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string) : undefined,
      });
      toast.success("Education added");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to add education");
    }
    setLoading(false);
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-amber-500" />
          <CardTitle>Education</CardTitle>
        </div>
        {isOwnProfile && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Education</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select name="type" defaultValue="SCHOOL">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCHOOL">School</SelectItem>
                      <SelectItem value="COLLEGE">College / University</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Institution Name</Label>
                  <Input name="institutionName" required placeholder="e.g. Delhi Public School" />
                </div>
                <div className="space-y-2">
                  <Label>Class / Course</Label>
                  <Input name="courseOrClass" required placeholder="e.g. 12th Grade or B.Tech CS" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input name="startDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input name="endDate" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Grade / Percentage (Optional)</Label>
                  <Input name="score" placeholder="e.g. 95% or 9.5 CGPA" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {!profile.educations?.length ? (
          <Empty text="No education details added yet." />
        ) : (
          <div className="space-y-4">
            {profile.educations.map((ed: any) => (
              <div key={ed.id} className="group flex justify-between rounded-md border border-slate-100 p-3 hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">{ed.institutionName}</p>
                  <p className="text-sm text-slate-600">{ed.courseOrClass} {ed.score ? ` • ${ed.score}` : ""}</p>
                  {(ed.startDate || ed.endDate) && (
                    <p className="text-xs text-slate-400 mt-1">
                      {ed.startDate ? format(new Date(ed.startDate), "MMM yyyy") : "N/A"} - {ed.endDate ? format(new Date(ed.endDate), "MMM yyyy") : "Present"}
                    </p>
                  )}
                </div>
                {isOwnProfile && (
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-red-500" onClick={async () => {
                    await deleteEducation(ed.id);
                    toast.success("Deleted");
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =======================
// EXPERIENCE
// =======================
function ExperienceSection({ profile, isOwnProfile }: { profile: any; isOwnProfile: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addExperience({
        company: formData.get("company") as string,
        role: formData.get("role") as string,
        description: formData.get("description") as string,
        startDate: new Date(formData.get("startDate") as string),
        endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string) : undefined,
        isCurrent: formData.get("isCurrent") === "on",
      });
      toast.success("Experience added");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to add experience");
    }
    setLoading(false);
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-500" />
          <CardTitle>Experience</CardTitle>
        </div>
        {isOwnProfile && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Experience</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Company / Organization</Label>
                  <Input name="company" required placeholder="e.g. Google" />
                </div>
                <div className="space-y-2">
                  <Label>Role / Title</Label>
                  <Input name="role" required placeholder="e.g. Software Engineer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input name="startDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input name="endDate" type="date" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="isCurrent" id="isCurrent" />
                  <Label htmlFor="isCurrent">I currently work here</Label>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea name="description" placeholder="Describe what you did..." />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {!profile.experiences?.length ? (
          <Empty text="No experience details added yet." />
        ) : (
          <div className="space-y-4">
            {profile.experiences.map((ex: any) => (
              <div key={ex.id} className="group flex justify-between rounded-md border border-slate-100 p-3 hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">{ex.role}</p>
                  <p className="text-sm text-slate-600">{ex.company}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {format(new Date(ex.startDate), "MMM yyyy")} - {ex.isCurrent || !ex.endDate ? "Present" : format(new Date(ex.endDate), "MMM yyyy")}
                  </p>
                  {ex.description && <p className="text-sm text-slate-500 mt-2">{ex.description}</p>}
                </div>
                {isOwnProfile && (
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-red-500" onClick={async () => {
                    await deleteExperience(ex.id);
                    toast.success("Deleted");
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =======================
// ACHIEVEMENTS
// =======================
function AchievementsSection({ profile, isOwnProfile }: { profile: any; isOwnProfile: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addAchievement({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        date: formData.get("date") ? new Date(formData.get("date") as string) : undefined,
      });
      toast.success("Achievement added");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to add achievement");
    }
    setLoading(false);
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <CardTitle>Achievements</CardTitle>
        </div>
        {isOwnProfile && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Achievement</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input name="title" required placeholder="e.g. JEE Rank 452 or Hackathon Winner" />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input name="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea name="description" placeholder="Brief details about the achievement..." />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {!profile.achievements?.length ? (
          <Empty text="No achievements added yet." />
        ) : (
          <div className="space-y-4">
            {profile.achievements.map((ac: any) => (
              <div key={ac.id} className="group flex justify-between rounded-md border border-slate-100 p-3 hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">{ac.title}</p>
                  {ac.date && <p className="text-xs text-slate-400 mt-1">{format(new Date(ac.date), "MMM yyyy")}</p>}
                  {ac.description && <p className="text-sm text-slate-500 mt-2">{ac.description}</p>}
                </div>
                {isOwnProfile && (
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-red-500" onClick={async () => {
                    await deleteAchievement(ac.id);
                    toast.success("Deleted");
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =======================
// SKILLS
// =======================
function SkillsSection({ profile, isOwnProfile }: { profile: any; isOwnProfile: boolean }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addSkill({
        name: formData.get("name") as string,
        level: formData.get("level") as "BEGINNER" | "INTERMEDIATE" | "PRO" | "EXPERT",
      });
      toast.success("Skill added");
      setOpen(false);
    } catch (err) {
      toast.error("Failed to add skill");
    }
    setLoading(false);
  }

  const getLevelColor = (level: string) => {
    switch(level) {
      case "BEGINNER": return "bg-slate-100 text-slate-600";
      case "INTERMEDIATE": return "bg-blue-100 text-blue-700";
      case "PRO": return "bg-amber-100 text-amber-700";
      case "EXPERT": return "bg-emerald-100 text-emerald-700";
      default: return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-500" />
          <CardTitle>Skills</CardTitle>
        </div>
        {isOwnProfile && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Skill</DialogTitle>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Skill Name</Label>
                  <Input name="name" required placeholder="e.g. Mathematics, Guitar, Web Development" />
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select name="level" defaultValue="INTERMEDIATE">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="PRO">Pro</SelectItem>
                      <SelectItem value="EXPERT">Master / Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {!profile.skills?.length ? (
          <Empty text="No skills added yet." />
        ) : (
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.skills.map((sk: any) => (
              <div key={sk.id} className="group relative flex items-center gap-2 rounded-full border border-slate-200 pl-3 pr-2 py-1 text-sm font-medium transition-all hover:border-slate-300">
                <span>{sk.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getLevelColor(sk.level)}`}>
                  {sk.level}
                </span>
                {isOwnProfile && (
                  <button type="button" className="ml-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={async () => {
                    await deleteSkill(sk.id);
                    toast.success("Deleted");
                  }}>
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
