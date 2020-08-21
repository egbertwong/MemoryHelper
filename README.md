# Memory Helper
Ebbinghaus memory method helper

# Interface

## Today

Can filter by type and status.

| ID        | Type   | Length | Allow Null | Description              |
| --------- | ------ | ------ | ---------- | ------------------------ |
| uuid      | String | 32     | false      |                          |
| name      | String | 20     | false      |                          |
| type      | int    | 1      | false      |                          |
| status    | int    | 1      | false      |                          |
| plan_date | time   |        | false      | Date to finish the plan. |



## Scheduled

Can filter by type and status.

| ID        | Type   | Length | Allow Null | Description              |
| --------- | ------ | ------ | ---------- | ------------------------ |
| uuid      | String | 32     | false      |                          |
| name      | String | 20     | false      |                          |
| status    | int    | 1      | false      |                          |
| plan_date | time   |        | false      | Date to finish the plan. |



## Completed

Filter by types.

| ID        | Type   | Length | Allow Null | Description      |
| --------- | ------ | ------ | ---------- | ---------------- |
| uuid      | String | 32     | false      |                  |
| name      | String | 20     | false      |                  |
| type      | String | 20     | false      |                  |
| status    | int    | 32     | false      |                  |
| plan_date | time   |        | false      |                  |
| done_date | time   |        | false      |                  |
| rate      | int    | 1      | false      | Rate from 1 to 5 |



## All Plans

Can filter by type and status.

| ID   | Type | Length | Allow Null | Description |
| ---- | ---- | ------ | ---------- | ----------- |
|      |      |        |            |             |



### About

- Project name:

- Version:

- Author:

- Check update



# Database

Database use 

## Type Table

| ID   | Type   | Length | Allow Null | Description |
| ---- | ------ | ------ | ---------- | ----------- |
| uuid | String | 32     | false      |             |
| name | String | 20     | false      |             |



## Plans

| ID           | Type   | Length | Allow Null | Description                                                  |
| ------------ | ------ | ------ | ---------- | ------------------------------------------------------------ |
| uuid         | String | 32     | false      |                                                              |
| name         | String | 20     | false      |                                                              |
| type         | String | 20     | false      |                                                              |
| status       | int    | 32     | false      | 0: haven't done, <br>1: learn once time, <br>2: learn next day, <br>3: learn next week, turn into monthly plan. |
| Time_1       | time   |        | true       | First learn time                                             |
| Time_Last    | time   |        | true       | Last learn time.                                             |
| Time_Next    | time   |        | true       | Next time to learn.                                          |
| frequency    | int    | 32     | true       | Number of reviews.                                           |
| Delayed_Days | int    | 32     | true       | Delayed days.                                                |
| Rate         | int    | 32     | true       | Range: 1-5                                                   |



## Scheduled

| ID        | Type   | Length | Allow Null | Description              |
| --------- | ------ | ------ | ---------- | ------------------------ |
| uuid      | String | 32     | false      |                          |
| name      | String | 20     | false      |                          |
| type      | String | 20     | false      |                          |
| status    | int    | 32     | false      |                          |
| plan_date | time   |        | false      | Date to finish the plan. |



## Completed

| ID        | Type   | Length | Allow Null | Description      |
| --------- | ------ | ------ | ---------- | ---------------- |
| uuid      | String | 32     | false      |                  |
| name      | String | 20     | false      |                  |
| type      | String | 20     | false      |                  |
| status    | int    | 32     | false      |                  |
| plan_date | time   |        | false      |                  |
| done_date | time   |        | false      |                  |
| rate      | int    | 1      | false      | Rate from 1 to 5 |