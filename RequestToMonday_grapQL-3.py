import requests
import json
import pandas as pd


apiKey = ""

apiUrl = "https://api.monday.com/v2"
headers = {"Authorization": apiKey}

#GraphQL query to retrieve data from Monday.com
query2 = 'query {  boards(limit:1,ids:[3894196945]) {  name  groups(ids:["topics"]){ title items{  name   column_values{  title  text}}}}}'

data = {'query': query2}

json_data = json.loads(requests.post(
    url=apiUrl, json=data, headers=headers).text)


number_of_columns = len(json_data['data']['boards'][0]
                        ['groups'][0]['items'][0]['column_values'])

print("\n\nNumber of columns: ", number_of_columns)


titles = []
for i in range(number_of_columns-1):  # grab column titles from Monday.com response
    titles.append(json_data['data']['boards'][0]['groups']
                  [0]['items'][0]['column_values'][i]['title'])

# the response from Monday.com misses the first column, so we have to add it manually
headers_excel = ['Name']
# merge the column titles with the first header "Name"
headers_excel = headers_excel + titles

print("Headers_excel: ", headers_excel)  # print to see the result

num_items = len(json_data['data']['boards'][0]
                ['groups'][0]['items'][0]['column_values'][0]['text'])

print("\n\nNumber of items: ", num_items)

exit()

data = [[item['name']] + [c_v['text']
                          for c_v in item['column_values']]
        for item in json_data['data']['boards'][0]['groups'][0]['items'][0]['column_values']]


df = pd.DataFrame(data)

num_rows = df.shape[0]  # count number of rows
print("\nNumber of rows:", num_rows)
print("\n\nData: ", data)


print("\n\ndf: ", df)


file = open("data.csv", "w")
file.truncate(0)  # clean the all columns in the csv file
file.close()
df.to_csv(r'data.csv', index=None, sep=";")


print("\ndf: ", df)
df.to_excel("data2.xlsx", index=None, header=headers_excel)
