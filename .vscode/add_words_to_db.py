
from sys import argv
from cloudant.client import Cloudant
from cloudant.error import CloudantException
#from cloudant.result import Result, ResultByKey
import time

def save_to_cloudant(dat, databaseName):
    servicename='apikey-v2-20xjdhneveh16e7pmw5q7rzcpoyrqyr9q8g2qn6r2zx1'
    servicepassword='18a55886551256555a57e99e85758a41'
    serviceurl='https://bc507a23-42ef-4cf8-8ba2-f73d52d1313b-bluemix.cloudantnosqldb.appdomain.cloud'

    client = Cloudant(servicename, servicepassword, url=serviceurl)
    client.connect()
    myDatabaseDemo = client[databaseName]
    for d in dat:
        myDatabaseDemo.create_document(d)
        time.sleep(0.2)

# expected file format: 'german line' /tab 'english meaning comma separated options'
if len(argv) < 2:
    print('Please give the input file name as a parameter')
    exit(1)
with open(argv[1]) as f1:
    text = f1.readlines()
docs = []
id = 1001
for line in text:
    line_split = line.split('\t')
    try:
        docs.append({'_id': str(id),
            'german': line_split[0].strip(),
            'english': line_split[1].strip()})
        id = id + 1
    except:
        print('Line "{}" has wrong format'.format(line.strip()))
#print(docs)
save_to_cloudant(docs, 'words')