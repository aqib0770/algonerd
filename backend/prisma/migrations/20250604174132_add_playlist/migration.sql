-- CreateTable
CREATE TABLE "PlayList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemsInPlaylist" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProblemsInPlaylist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayList_name_userId_key" ON "PlayList"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProblemsInPlaylist_playlistId_problemId_key" ON "ProblemsInPlaylist"("playlistId", "problemId");

-- AddForeignKey
ALTER TABLE "PlayList" ADD CONSTRAINT "PlayList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemsInPlaylist" ADD CONSTRAINT "ProblemsInPlaylist_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "PlayList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemsInPlaylist" ADD CONSTRAINT "ProblemsInPlaylist_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
