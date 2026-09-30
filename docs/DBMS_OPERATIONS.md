# DBMS Operations Notes

## CRUD usage

The application uses Spring Data JPA repositories built on JpaRepository.

### Create
New entities are persisted with repository save(...). The database seeder also uses DonorRepository.save(...) to insert demonstration donors.

### Read
The project uses repository methods such as:

- findByContactEmail(...) for donor/requester lookup.
- findByStatus(...) for blood-request status filtering.
- findByRequester_RequesterIdOrderByCreatedAtDesc(...) for a requester's history.
- findEligibleDonorsNearby(...) for donor selection through a native SQL query.

### Update
Entities can be modified and persisted through the repository layer using save(...). With JPA, changes to managed entities can also be synchronized with the database during a transaction.

### Delete
Because the repositories extend JpaRepository, standard delete operations are available even where a dedicated controller method is not currently documented here.

## Repository responsibilities

- DonorRepository: donor persistence, email lookup, verification counts and donor search.
- BloodRequestRepository: blood-request persistence, status filtering and requester-based history.
- MatchRecordRepository: persistence of request-to-donor match records.

## Backend-to-database flow

1. A controller/service receives application data.
2. The data is represented by a JPA entity.
3. A Spring Data repository performs the persistence or query operation.
4. Hibernate translates the repository operation into SQL.
5. PostgreSQL stores or returns the records.

This keeps database access in the repository layer instead of putting SQL directly in the frontend.
