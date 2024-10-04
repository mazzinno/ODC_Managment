"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Calendar, Clock, AlertCircle, Search, CheckCircle2, Users, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

const WorkflowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" />
    <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" />
    <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" />
    <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" />
  </svg>
)

export default function Homepage() {
  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [userName, setUserName] = useState("User")
  const [totalStudents, setTotalStudents] = useState(null)
  const [totalFormations, setTotalFormations] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesResponse = await fetch(
          `${import.meta.env.VITE_API_LINK}/api/courses/GetFormationsOfMentor`,
          { credentials: "include" }
        )
        if (!coursesResponse.ok) throw new Error("Failed to fetch courses")
        const coursesData = await coursesResponse.json()
        setCourses(coursesData)

        //////////////////////////////////////////////////////////////////////////////////////////
        const userResponse = await fetch(`${import.meta.env.VITE_API_LINK}/api/home/Gethomepageinfo`, {
          credentials: "include",
        })
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserName(userData.firstName)
          setTotalStudents(userData.totalStudents)
          setTotalFormations(userData.totalFormations)
        }

        
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const currentDate = new Date()
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const currentCourses = filteredCourses.filter(
    (course) => new Date(course.startDate) <= currentDate && new Date(course.endDate) >= currentDate
  )
  const upcomingCourses = filteredCourses.filter((course) => new Date(course.startDate) > currentDate)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-orange-50 to-white ">
      <div className="container mx-auto px-4 py-8">

        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Welcome back, {userName} <span className="wave">👋</span>
        </h1>

        <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:space-x-8">
          <div className="w-full lg:w-1/4 space-y-6">
            <Link to="/workflow">
              <Button
                className="w-full text-lg font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:from-orange-600 hover:to-amber-600"
                size="lg"
              >
                <WorkflowIcon />
                <span className="ml-2">WorkFlow</span>
              </Button>
            </Link>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-2 border-amber-200 focus:border-amber-500 ring-0 focus-visible:ring-offset-0 focus-visible:ring-0 rounded-full text-gray-800 placeholder-gray-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" size={20} />
            </div>
          </div>


          <div className="w-full lg:w-1/2 space-y-8">
            {/* Current Events Section */}
            <Card className="overflow-hidden shadow-xl rounded-lg border-t-4 border-t-amber-500">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Calendar className="mr-2" /> Current Events
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-amber-100 max-h-[300px] overflow-y-auto bg-white">
                {currentCourses.length > 0 ? (
                  currentCourses.map((course) => (
                    <div key={course._id} className="py-4 flex items-start space-x-4">
                      <div className="bg-amber-100 rounded-full p-2 flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
                        <p className="text-sm text-amber-600 font-medium">
                          {`${new Date(course.startDate).toLocaleDateString()} - ${new Date(
                            course.endDate
                          ).toLocaleDateString()}`}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Type: <span className="font-medium text-gray-700">{course.type}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Mentors:{" "}
                          <span className="font-medium text-gray-700">
                            {course.mentors.map((mentor) => mentor.email).join(", ")}
                          </span>
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full">
                          In Progress
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-gray-500">No current events found.</p>
                )}
              </CardContent>
            </Card>


            {/* Upcoming Events Section */}
            <Card className="overflow-hidden shadow-xl rounded-lg border-t-4 border-t-amber-500">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <Clock className="mr-2" /> Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-amber-100 max-h-[300px] overflow-y-auto bg-white">
                {upcomingCourses.length > 0 ? (
                  upcomingCourses.map((course) => (
                    <div key={course._id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-amber-100 rounded-full p-2 flex-shrink-0">
                          <Clock className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
                          <p className="text-sm text-amber-600 font-medium">
                            {`${new Date(course.startDate).toLocaleDateString()} - ${new Date(
                              course.endDate
                            ).toLocaleDateString()}`}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Type: <span className="font-medium text-gray-700">{course.type}</span>
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Mentors:{" "}
                            <span className="font-medium text-gray-700">
                              {course.mentors.map((mentor) => mentor.email).join(", ")}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 bg-amber-500 text-white px-3 py-1 rounded-full shadow-md">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-bold text-center">Coming Soon</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-gray-500">No upcoming events found.</p>
                )}
              </CardContent>
            </Card>
          </div>


          
          {/* Overall Students and Total Formations Cards */}
          <div className="w-full lg:w-1/5 space-y-8">
            <Card className="overflow-hidden shadow-lg rounded-lg">
              <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 p-6 text-white">
                <CardTitle className="text-lg font-semibold flex items-center mb-2">
                  <Users className="mr-2" /> Overall Students
                </CardTitle>
                <p className="text-4xl font-bold">{totalStudents}</p>
              </div>
            </Card>
            <Card className="overflow-hidden shadow-lg rounded-lg">
              <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-amber-500 p-6 text-white">
                <CardTitle className="text-lg font-semibold flex items-center mb-2">
                  <BookOpen className="mr-2" /> Total Formations
                </CardTitle>
                <p className="text-4xl font-bold">{totalFormations}</p>
              </div>
            </Card>
          </div>
        </div>


      </div>
    </div>
  )
}