-- CreateTable
CREATE TABLE "SurveyResult" (
    "id" SERIAL NOT NULL,
    "surveyId" TEXT NOT NULL,
    "ans1" INTEGER NOT NULL,
    "ans2" INTEGER NOT NULL,
    "ans3" INTEGER NOT NULL,
    "ans4" INTEGER NOT NULL,
    "ans5" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyResult_pkey" PRIMARY KEY ("id")
);
