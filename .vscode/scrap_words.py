import requests
from bs4 import BeautifulSoup
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
    try:
        client.delete_database(databaseName)
    except CloudantException:
        pass
    else: 
        print('Database {} found and deleted'.format(databaseName))
    myDatabaseDemo = client.create_database(databaseName)
    for d in dat:
        myDatabaseDemo.create_document(d)
        time.sleep(0.2)


URL = 'https://1000mostcommonwords.com/1000-most-common-german-words'
page = requests.get(URL)
soup = BeautifulSoup(page.content, 'html.parser')
res = soup.find('table')
lines = res.find_all('tr')
docs = []
for line in lines:
    words = line.find_all('td')
    try:
        id = int(words[0].text.strip())
    except ValueError:
        continue
    print('id={} german= {} english= {}'.format(id, 
        words[1].text.strip(), words[2].text.strip()), end='\n')
    docs.append({'_id': words[0].text.strip(),
        'german': words[1].text.strip(),
        'english': words[2].text.strip()})

save_to_cloudant(docs, 'words')