
from cloudant.client import Cloudant
from cloudant.error import CloudantException


servicename='apikey-v2-20xjdhneveh16e7pmw5q7rzcpoyrqyr9q8g2qn6r2zx1'
servicepassword='18a55886551256555a57e99e85758a41'
serviceurl='https://bc507a23-42ef-4cf8-8ba2-f73d52d1313b-bluemix.cloudantnosqldb.appdomain.cloud'

client = Cloudant(servicename, servicepassword, url=serviceurl)
client.connect()
mydatabase = client['words']

mydoc = mydatabase['3']

print(mydoc)

client.disconnect()
