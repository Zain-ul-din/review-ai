"use server";
import {
  FeedbackFormType,
  feedbackSchema,
} from "@/shared/definitions/feedback";
import { auth } from "@clerk/nextjs/server";
import { getDB } from "../db";
import { collections } from "../db/collections";

export async function submitFeedback(feedback: FeedbackFormType) {
  const validatedFields = feedbackSchema.safeParse(feedback);

  if (validatedFields.error) {
    return validatedFields.error.flatten().fieldErrors;
  }

  const { userId } = await auth();

  const db = await getDB();

  db.collection(collections.usersFeedback).insertOne({
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...validatedFields.data,
  });
}
