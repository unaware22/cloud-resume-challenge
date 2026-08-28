import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('visitor-count')

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
}


def lambda_handler(event, context):
    http_method = event.get('httpMethod', 'GET')

    # ─── CORS Preflight ───────────────────────────────────────────────────────
    if http_method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({'message': 'OK'})
        }

    # ─── POST: Kunjungan pertama — cek visitor_id, increment jika baru ────────
    if http_method == 'POST':
        try:
            body = event.get('body', '{}') or '{}'
            if isinstance(body, str):
                body = json.loads(body)
            visitor_id = body.get('visitor_id', '').strip()
        except (json.JSONDecodeError, AttributeError):
            visitor_id = ''

        if not visitor_id:
            return {
                'statusCode': 400,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': 'visitor_id is required'})
            }

        # Ambil item saat ini dari DynamoDB
        response = table.get_item(Key={'id': 'resume'})
        item = response.get('Item', {})
        current_count = int(item.get('visitor_count', 0))
        visitors = item.get('visitors', set())  # DynamoDB StringSet -> Python set

        if visitor_id not in visitors:
            # Visitor baru -> increment counter dan tambahkan visitor_id ke Set
            new_count = current_count + 1
            table.update_item(
                Key={'id': 'resume'},
                UpdateExpression='SET visitor_count = :c ADD visitors :v',
                ExpressionAttributeValues={
                    ':c': new_count,
                    ':v': {visitor_id}  # Python set -> DynamoDB StringSet (SS)
                }
            )
            return {
                'statusCode': 200,
                'headers': CORS_HEADERS,
                'body': json.dumps({'visitor_count': new_count, 'is_new': True})
            }
        else:
            # Visitor sudah pernah berkunjung -> hanya return count, tanpa increment
            return {
                'statusCode': 200,
                'headers': CORS_HEADERS,
                'body': json.dumps({'visitor_count': current_count, 'is_new': False})
            }

    # ─── GET: Return visitor count saja, tanpa increment ─────────────────────
    response = table.get_item(Key={'id': 'resume'})
    item = response.get('Item', {})
    count = int(item.get('visitor_count', 0))

    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps({'visitor_count': count})
    }
