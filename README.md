![az_postgresql](az_postgresql.png)
# az_postgresql

A **FiveM** resource that allows seamless communication with a **PostgreSQL** database using [postgres.js](https://github.com/porsager/postgres).

## Features
- **Async request**
- **Simple surface API**
- **Built-in lightweight ORM**
- **Dynamic query support**
- **[WIP] Compatibility layer for `ox_mysql`**

## Why use PostgreSQL instead of MySQL

PostgreSQL is often regarded as the superior choice over MySQL due to its greater power, flexibility, and reliability—particularly for complex or large-scale applications.

It offers advanced data types such as JSON, arrays, and custom-defined types, enabling sophisticated data modeling that MySQL either lacks or has only recently begun to support. Additionally, PostgreSQL supports more complex and efficient query capabilities that facilitate advanced database operations.

The database excels in handling high concurrency, efficiently managing numerous simultaneous users or processes without performance degradation or locking issues. PostgreSQL enforces strict data integrity and consistency through robust constraints and standards-compliant transaction management, whereas MySQL can occasionally overlook such safeguards, potentially leading to data anomalies in demanding environments.

Furthermore, PostgreSQL combines traditional relational database strengths with powerful NoSQL-like features, such as efficient JSON querying and indexing, all within a fully open-source platform without proprietary restrictions or hidden costs.

For projects requiring scalability, robustness, and advanced functionality—such as sophisticated FiveM servers or enterprise-grade applications—PostgreSQL is generally the more appropriate and reliable choice.

## Why use postgres.js instead of other PostgreSQL libraries

[postgres.js](https://github.com/porsager/postgres) is a modern, fast, and easy-to-use PostgreSQL client for Node.js that offers several benefits over other libraries:

- **Performance**: It is designed for speed and efficiency, using native bindings and optimized queries to make database calls faster.
- **Simple API**: The interface is straightforward and clean, making it easy to write and read database queries without extra complexity.
- **Promises & Async/Await**: Supports modern JavaScript features like promises and async/await out of the box, making asynchronous code simpler to write and maintain.
- **Lightweight**: It has a small footprint with minimal dependencies, which keeps your project lean and reduces potential bugs.
- **Dynamic Query Support**: Easily build queries dynamically with parameters, reducing the risk of SQL injection and improving flexibility.
- **Good Community & Maintenance**: Actively maintained with good documentation, making it reliable for long-term projects.

Compared to older or heavier libraries, postgres.js balances speed, simplicity, and modern features perfectly, making it a great choice for projects like FiveM resources that need efficient and reliable PostgreSQL communication.

## Installation

Ensure that [`postgres.js`](https://github.com/porsager/postgres) is installed:

```bash
npm install postgres
```

## Project structure

```
.
├── fxmanifest.lua                            # Resource manifest for FiveM
├── server/                                   # Server-side logic
│   ├── init.lua                              # Lua entry point to bootstrap PostgreSQL logic
│   ├── init.js                               # JavaScript entry point for setting up postgres.js
│   ├── update.lua                            # Handles schema updates or DB syncing
│   ├── modules/                              # Logic modules
│   │   ├── database/                         # Core database interactions
│   │   │   ├── execute_file.js               # Executes raw SQL files
│   │   │   ├── insert.js                     # Handles ORM-style inserts
│   │   │   ├── listener.js                   # Listens for PostgreSQL NOTIFY/LISTEN events
│   │   │   ├── raw_query.js                  # Executes raw SQL with parameters
│   │   │   ├── select.js                     # Handles ORM-style SELECTs
│   │   │   ├── transaction.js                # Executes transactional batch queries
│   │   │   └── update.js                     # Handles ORM-style UPDATEs
│   │   ├── helpers/                          # Development tools
│   │   │   ├── profiler.js                   # Simple performance profiler
│   │   │   └── query_time.js                 # Logs query execution times
│   │   └── utils/                            # Utility functions
│   │       ├── logger.js                     # Logs events and errors
│   │       ├── normalize.js                  # Normalizes inputs and outputs
│   │       ├── sanitize.js                   # Cleans potentially unsafe inputs
│   │       └── delay.js                      # Introduces artificial delay for async control

```

## Getting Started

### Initialize the module

```lua
local PostgreSQL = exports['az_postgresql']:init()
```

### Wait for the module to be ready before using it

```lua
PostgreSQL.ready(function()

    -- INSERT example
    PostgreSQL.insert("users", { name = 'Stephanie' }, function(success, inserted_data)
        print(success, json.encode(inserted_data))
    end)

    -- TRANSACTION example
    local queries = {
        { query = "SELECT * FROM users", params = {} },
        { query = "SELECT * FROM users WHERE name = $1", params = { 'Stephanie' } }
    }

    PostgreSQL.transaction(queries, function(success, results)
        print(success, json.encode(results))
    end)

    -- EXECUTE SQL FILE
    PostgreSQL.execute_file(GetResourcePath(GetCurrentResourceName()) .. '/test.sql')

    -- UPDATE example
    PostgreSQL.update("users", { name = "Johnny" }, { name = 'Jhon' }, function(success, result)
        print(success, json.encode(result))
    end)

    -- SELECT example
    PostgreSQL.select("users", { '*' }, { name = 'Bernard' }, function(success, results)
        print(success, json.encode(results))
    end)

end)
```

## Notes

- All queries are **asynchronous** and use a **callback-first** approach.
- You can safely run multiple queries or batches in transactions.
- The query interface is inspired by a combination of `oxmysql` (for its FiveM integration) and **ActiveRecord-style ORM** from Rails.

## Inspiration

- [Oxmysql by overextended](https://github.com/overextended/oxmysql) – A battle-tested MySQL library for FiveM.
- [Rails ORM (ActiveRecord)](https://github.com/rails/rails) – Elegant, declarative ORM in Ruby on Rails.
- [postgres.js](https://github.com/porsager/postgres) – Minimal and performant PostgreSQL client for Node.js.

## TODO / WIP

- [ ] Full compatibility layer for ox_mysql API
- [ ] Full test coverage
- [ ] Schema migration system
- [ ] Advanced type casting from Lua ↔ PostgreSQL

## Contributing

PRs and suggestions are welcome. Please make sure to lint your code and keep consistent structure.
