# CRUD Builder CLI

A powerful CLI tool that automatically generates all files necessary for CRUD operations in web frameworks. Currently supports NestJS with TypeORM integration.

## Features

- **Automatic CRUD Generation**: Generate complete CRUD operations from CSV schema files
- **NestJS Support**: Create controllers, services, modules, DTOs, and TypeORM entities
- **Database Integration**: Automatic database connection setup with environment variable support
- **Project Scaffolding**: Create new NestJS projects with a single command
- **Data Validation**: Generate validation pipes based on your data schema
- **TypeScript Ready**: Full TypeScript support with proper type definitions

## Installation

### Prerequisites

1. Ensure you have knowledge about the one of these frameworks:

- **NextJS**
- **ExpressJS**
- **NestJS**

2. Ensure you have knowledge on CRUD operation on one of the above mention frameworks.
3. Install Nodejs and npm by visiting its website (https://nodejs.org/en) or install using homebrew.

```bash
  brew install node
```

4. Ensure you have git install if you want to clone our project.

```bash
  brew install git
```

### Install CRUD Builder

#### 1. Clone from gihub

```bash
  git clone https://github.com/wat6714522/CRUD-Builder.git
```

After cloning to navigate to your project and install npm packages. **Note that your CLI tools will not work if you do not have the packages install.**

```bash
  npm install --save
```

```bash
  npm install --save-dev
```

Then we recommend you to make your CLI Tools run globally for ease of use by following these steps:

1. Navigate to your project folder if you haven't yet.
2. Make on program executable.

```bash
  chmod +x <pathToYourProjectRoot>
```

3. Create a symlink.

```bash
  npm link
```

## Support Framework

### NestJS

The project have three following commands:

1. **Create:** creating NestJS project.
2. **Generate:** generating NestJS components for crud operations:
3. **dBConnect** generate config file for database connection

```bash
  crud nestjs create <projectName>
```

#### Argument

`projectName`: Specify the project name of your project.

```bash
  crud nestjs generate [options] <csvPath> <component>
```

#### Argument

- `csvPath`: Specify the path of your csv.
- `component`: Specify the component you want to generate (`controller`, `service`, `module`, `entity`, `dto` or `all`).

#### Options

- `-d, --directory <filePath>`: Specify the output directory of your generated components.

```bash
  crud nestjs connect [options]
```

**Options:**

- `-d, --directory <filePath>`: Specify the output path for the database config file
- `-e, --envPath <filePath>`: Specify the path of the .env file containing database environment variables

**Required Environment Variables:**
Your `.env` file should contain the following variables:

```env
DB_TYPE
DB_HOST
DB_PORT
DB_USERNAME
DB_PASSWORD
DB_NAME
```

**Examples:**

```bash
  # Create command
  crud nestjs create MyApp

  # Connect command
  crud nestjs connect --directory ./MyApp/src

  # Generate command
  crud nestjs generate --directory ./MyApp/src Entity
```

### 3. Generate CRUD Components

```bash
crud nestjs generate <csvPath> <component> [options]
```

## CSV Schema Format

The CSV file should follow this structure:

1. **First row**: Column headers (used as field names)
2. **First column**: Primary key field
3. **Subsequent rows**: Sample data for type inference

**Example CSV (`users.csv`):**

```csv
id,name,email,age,isActive,salary,createdAt
1,John Doe,john@example.com,30,true,50000.50,2023-01-01
2,Jane Smith,jane@example.com,25,false,45000.75,2023-01-02
3,Bob Johnson,bob@example.com,35,true,60000.00,2023-01-03
```

This will generate:

- `id`: Primary key (number)
- `name`: String field
- `email`: String field with email validation
- `age`: Number field
- `isActive`: Boolean field
- `salary`: Decimal number field
- `createdAt`: Date field

## Generated File Structure

After running the generate command, you'll get:

```
src/
├── entities/
│   └── user.entity.ts
├── dto/
│   ├── create-user.dto.ts
│   ├── update-user.dto.ts
│   ├── id-param.dto.ts
│   └── pagination.dto.ts
├── pipes/
│   ├── parse-array.pipe.ts
│   ├── parse-bool.pipe.ts
│   ├── parse-id.pipe.ts
│   ├── parse-uuid.pipe.ts
│   └── request-header.pipe.ts
├── controllers/
│   └── user.controller.ts
├── services/
│   └── user.service.ts
└── modules/
    └── user.module.ts
```

## API Endpoints Generated

The generated controller includes these endpoints:

- `GET /users` - Get all users with pagination
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Development

### Running Tests

```bash
  npm test
```

### Watch Mode

```bash
  npm run test:watch
```

### Project Structure

```
CRUD-Builder/
├── bin/                    # CLI entry points
├── commands/               # Command implementations
│   └── NestJS/
├── src/
│   ├── generators/         # Code generators
│   └── utils/             # Utility functions
├── template/              # Code templates
│   └── NestJS/
└── test/                  # Test files and fixtures
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Authors

P&P Squad
