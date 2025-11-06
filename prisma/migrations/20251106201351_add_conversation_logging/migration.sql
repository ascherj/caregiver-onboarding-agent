-- CreateTable
CREATE TABLE "ConversationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "ConversationLog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "CaregiverProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConversationMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userMessage" TEXT NOT NULL,
    "agentResponse" TEXT NOT NULL,
    "llmRawResponse" TEXT NOT NULL,
    "extractedData" TEXT,
    "extractedFields" TEXT,
    CONSTRAINT "ConversationMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ConversationLog" ("conversationId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ConversationLog_conversationId_key" ON "ConversationLog"("conversationId");

-- CreateIndex
CREATE INDEX "ConversationLog_profileId_idx" ON "ConversationLog"("profileId");

-- CreateIndex
CREATE INDEX "ConversationLog_status_idx" ON "ConversationLog"("status");

-- CreateIndex
CREATE INDEX "ConversationMessage_conversationId_idx" ON "ConversationMessage"("conversationId");

-- CreateIndex
CREATE INDEX "ConversationMessage_timestamp_idx" ON "ConversationMessage"("timestamp");
