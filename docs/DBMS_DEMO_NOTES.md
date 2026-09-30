# DBMS Demo Notes

## Database configuration

The backend is configured for PostgreSQL with:

- database: blooddonation
- JPA/Hibernate for ORM
- PostgreSQL dialect
- spring.jpa.show-sql=true for SQL visibility during development
- spring.jpa.hibernate.ddl-auto=update for schema synchronization during development

## Demo explanation

### How is a new blood request stored?

A BloodRequest entity contains the request data and a Requester reference. The repository layer can persist it with BloodRequestRepository.save(...), after which Hibernate generates the required SQL for PostgreSQL.

### How is a donor found?

The donor repository provides an email lookup and a native-query method for eligible nearby donors. The donor model stores blood type, verification status and latitude/longitude, which support matching logic.

### What does MatchRecord do?

It is the persistence record connecting a selected donor with a blood request. It also records the compatibility result and distance used by the matching workflow.

### What happens if no donor is found?

The matching workflow can return no eligible donor records. The database itself remains unchanged unless the application explicitly creates or updates a match/request record.

### Why use repositories?

Repositories centralize persistence operations and allow the application to use JPA-generated SQL instead of embedding database calls throughout controller code.

> Development note: database credentials are currently present in application.properties. For a deployed system, credentials should be supplied through environment variables or a secrets manager rather than committed source configuration.
