import { NextResponse } from "next/server";
import db from "@/libs/db"
import bcrypt from "bcrypt"

type Data = {
  email: string
  name: string
  lastname: string
  password: string
}

export async function POST(req: Request) {
  const data: Data = await req.json()

  if(data.email == "" && data.password == "") {
    const userFound = await db.user.findUnique({
      where: {
        email: data.email
      }
    })
  
    if (userFound) {
      return NextResponse.json({
        error: "El correo ya está en uso",
      }, {
        status: 400
      })
    }
  
    data.password = await bcrypt.hash(data.password, 10)
    const createdUser = await db.user.create({data})
  
    const {password, createdAt, updatedAt, ...dataToReturn} = createdUser
  
    return NextResponse.json({...dataToReturn})
  }
}