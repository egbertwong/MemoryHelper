# DATABASE README
The database, which is powered by Dexie.js, should run in html page. Please check `DatabaseManager.js`.
## Tables

### types

| ID   | Type   | Length | Allow Null | Description |
| ---- | ------ | ------ | ---------- | ----------- |
| uuid | String | 32     | false      |             |
| name | String | 20     | false      |             |

### tasks

| ID           | Type   | Length | Allow Null | Description                                                  |
| ------------ | ------ | ------ | ---------- | ------------------------------------------------------------ |
| uuid         | String | 32     | false      |                                                              |
| name         | String | 20     | false      |                                                              |
| type_id      | String | 20     | false      | types table                                                  |
| status       | int    | 32     | false      | 0: haven't done, <br>1: learn once time, <br>2: learn next day, <br>3: learn next week, turn into monthly plan. |
| Time_1       | time   |        | true       | First learn time                                             |
| Time_Last    | time   |        | true       | Last learn time.                                             |
| Time_Next    | time   |        | true       | Next time to learn.                                          |
| frequency    | int    | 32     | true       | Number of reviews.                                           |
| Delayed_Days | int    | 32     | true       | Delayed days.                                                |
| Rate         | int    | 32     | true       | Range: 1-5                                                   |

### scheduled

| ID        | Type   | Length | Allow Null | Description              |
| --------- | ------ | ------ | ---------- | ------------------------ |
| uuid      | String | 32     | false      |                          |
| name_id   | String | 20     | false      | tasks table              |
| type_id   | String | 20     | false      | types table              |
| status    | int    | 32     | false      |                          |
| plan_date | time   |        | false      | Date to finish the plan. |

### completed

| ID        | Type   | Length | Allow Null | Description      |
| --------- | ------ | ------ | ---------- | ---------------- |
| uuid      | String | 32     | false      |                  |
| name_id   | String | 20     | false      | tasks table      |
| type_id   | String | 20     | false      | types table      |
| status    | int    | 32     | false      |                  |
| plan_date | time   |        | false      |                  |
| done_date | time   |        | false      |                  |
| rate      | int    | 1      | false      | Rate from 1 to 5 |
