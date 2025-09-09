# OrganizeIt- because not all tasks are created equal 
OrganizeIt is a responsive task manager that helps you organize and prioritize tasks efficiently. With a clean UI and priority tagging, it turns cluttered to-do lists into focused workflows.


# Entity Relationship Diagram (ERD)

┌──────────────────────────┐          ┌─────────────────────────┐
│         USER             │          │         TASK            │
├──────────────────────────┤          ├─────────────────────────┤
│ _id : ObjectId (PK)      │◀─────────│ owner : ObjectId (FK)   │
│ name : String            │   1 ───► │ title : String (req)    │
│ email : String (unique)  │          │ description : String    │
│ password : String (hash) │          │ priority : Enum         │
│ createdAt : Date         │          │ dueDate : Date          │
└──────────────────────────┘          │ completed : Boolean     │
                                      │ createdAt : Date        │
                                      └─────────────────────────┘
                                      
    - Foreign key will have link to the USER Primary Key