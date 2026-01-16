import PurchaseButton from "@/components/PurchaseButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ConvexHttpClient } from "convex/browser"
import { ArrowRight, Link } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

  const courses = await convex.query(api.courses.getCourses)

  return (
    <>
      <div className="flex flex-col-min-h-screen">
        <main className="grow container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4xl">Forge Your Path in Modern Development</h1>
            <p className="text-xl text-muted-forground max-w-2xl mx-auto">Master fullstack skills through engaging, project-based learning. Unlock your potential with MasterClass.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {
              courses.slice(0, 3).map(course => (
                <Card key={course._id} className="flex flex-col">
                  <a href={`/courses/${course._id}`} className="cursor-pointer">
                    <CardHeader>
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        width={640}
                        height={360}
                        className="rounded-md object-cover" />
                    </CardHeader>
                    <CardContent className="grow">
                      <CardTitle className="text-xl mb-2 hover:underline">
                        {course.title}
                      </CardTitle>
                    </CardContent>
                  </a>

                  <CardFooter className="flex justify-between items-center">
                    <Badge variant="default" className="text-lg px-3 py-1">
                      ${course.price.toFixed(2)}
                    </Badge>

                    <SignedIn>
                      <PurchaseButton courseId={course._id} />
                    </SignedIn>

                    <SignedOut>
                      <SignInButton mode="modal">
                        <Button variant="outline">
                          Enroll Now
                          <ArrowRight className="size-4" />
                        </Button>
                      </SignInButton>
                    </SignedOut>
                  </CardFooter>
                </Card>
              ))
            }
          </div>

          <div className="text-center">
            <a href="/pro">
              <Button size="lg" className="group hover:bg-purple-600 transition-colors duration-300">
                Explore Pro Plans
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition transform" />
              </Button>
            </a>
          </div>
        </main>
      </div>

    </>
  )
}
