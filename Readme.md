
# - Clone the repo: `git clone https://git-url`
 Navigate to the project directory: `cd users-management`
- Install dependencies: `npm install`

### Step 2: Environment Variables
_ Create `.env`.
- Add `PORT` variable example: `3000`.
- Add `DATABASE_URL` variable example: `file:./dev.db`.

### Database setup
- Run `npx prisma generate`
- Run `npx prisma db push`

### Running the app
- Run `npm run dev`

## Managing packages with `npm`
- `npm install <package-name>`
- `npm install -D <package-name>`
- `npm uninstall <package-name>`
- `npm update <package-name>`

## Prisma cammands
- `npx prisma studio`
- `npx prisma format`