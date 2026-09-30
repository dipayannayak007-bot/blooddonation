# DBMS Schema Notes

## Database stack

The backend uses Spring Data JPA with PostgreSQL. JPA entity classes are mapped to database tables, while repository interfaces provide persistence and query operations.

## Main entities

| Entity | Primary key | Important fields / role |
|---|---|---|
| Donor | donorId | donor identity, blood type, contact details, verification status, location and donation information |
| Requester | requesterId | requester identity, contact details and account type |
| BloodRequest | requestId | required blood type, units, urgency, status, location and requester reference |
| MatchRecord | matchId | links a blood request with a donor and stores compatibility, distance and creation time |
| SOSNotification | notificationId | links a notification to a match and stores delivery information |

## Relationships

- A Requester can have multiple BloodRequest records.
- Each BloodRequest belongs to one Requester through requester_id.
- A BloodRequest can be associated with multiple MatchRecord records.
- Each MatchRecord references one BloodRequest and one Donor.
- Each SOSNotification references one MatchRecord through a one-to-one relationship.

## Key constraints

- Primary keys are generated with JPA identity generation.
- Donor and requester email fields are marked unique.
- Required fields use nullable = false.
- The notification's match reference is unique, enforcing the one-to-one mapping.

## ORM mapping

The model layer uses JPA annotations such as @Entity, @Id, @GeneratedValue, @ManyToOne, @OneToOne, and @JoinColumn. Hibernate handles the object-to-relational mapping and the application is configured to update the schema automatically.
