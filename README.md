# Memory Helper
Ebbinghaus memory method helper

# Interface

## Today

Can filter by type and status.

| ID   | Type | Length | Allow Null | Description |
| ---- | ---- | ------ | ---------- | ----------- |
|      |      |        |            |             |



## All Plans

Filter by types.

| ID   | Type | Length | Allow Null | Description |
| ---- | ---- | ------ | ---------- | ----------- |
|      |      |        |            |             |



## All Actions

Can filter by type and status.

| ID   | Type | Length | Allow Null | Description |
| ---- | ---- | ------ | ---------- | ----------- |
|      |      |        |            |             |

# Database

Database use 

## Type Table

| ID   | Type   | Length | Allow Null | Description |
| ---- | ------ | ------ | ---------- | ----------- |
| uuid | String | 32     | false      |             |
| name | String | 20     | false      |             |



## Plan Table

| ID          | Type   | Length | Allow Null | Description                                                  |
| ----------- | ------ | ------ | ---------- | ------------------------------------------------------------ |
| uuid        | String | 32     | false      |                                                              |
| name        | String | 20     | false      |                                                              |
| status      | int    | 32     | false      | 0: haven't done, <br>1: learn once time, <br>2: learn next day, <br>3: learn next week, turn into monthly plan. |
| Time_1      | time   |        | true       | First learn time                                             |
| Time_2      | time   |        | true       | Next day learn time.                                         |
| Time_3      | time   |        | true       | Next week learn time.                                        |
| Time_4      | time   |        | true       | Next month learn time.                                       |
| Time_Last   | time   |        | true       | Last learn time.                                             |
| Time_Next   | time   |        | true       | Next time to learn.                                          |
| Delay_Times | int    | 32     | true       | Delay times.                                                 |
| Rate        | int    | 32     | true       | Range: 1-5                                                   |



## Action Table

| ID   | Type   | Length | Allow Null | Description |
| ---- | ------ | ------ | ---------- | ----------- |
| uuid | String | 32     | false      |             |
|      |        |        |            |             |