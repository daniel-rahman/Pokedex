from flask import Flask, jsonify, request, session
from flask_cors import CORS

import uuid
import db
import os 

app = Flask(__name__)
CORS(
    app,
    supports_credentials=True,
    resources={r"/*": {"origins": "http://localhost:5173"}}
)
 
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'your_super_secret_key_please_change_this_in_production')
all_pokemon = db.get()
captured_pokemon = set()

@app.route('/icon/<name>')
def get_icon_url(name:str):
    return f"https://img.pokemondb.net/sprites/silver/normal/{name.lower()}.png"

@app.route('/pokemon', methods=['GET'])
def get_pokemon():
   
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 20))
    sort_order = request.args.get('sort_order', 'asc')
    sort_by = request.args.get('sort_by', 'number')
    pokemon_type = request.args.get('type', 'all').lower() 
    
    pokemon_list = list(all_pokemon)

    if pokemon_type != 'all':
        pokemon_list = [p for p in pokemon_list if p.get('type_one', '').lower() == pokemon_type or p.get('type_two', '').lower() == pokemon_type]

    reverse_sort = sort_order == 'desc'
    if pokemon_list and sort_by in pokemon_list[0]:
        pokemon_list.sort(key=lambda p: p[sort_by], reverse=reverse_sort)
    elif sort_by == 'name': 
        pokemon_list.sort(key=lambda p: p['name'], reverse=reverse_sort)


    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    paginated_pokemon = pokemon_list[start_index:end_index]
    
    for pokemon in paginated_pokemon:
        pokemon['is_captured'] = pokemon['name'] in captured_pokemon
        pokemon['uuid'] = str(uuid.uuid4())
    
    total_items = len(pokemon_list)
    total_pages = (total_items + page_size - 1) // page_size 

    return jsonify({
        'pokemon': paginated_pokemon,
        'total_items': total_items,
        'total_pages': total_pages,
        'current_page': page,
        'page_size': page_size
    })

@app.route('/capture/<name>', methods=['POST'])
def capture_pokemon(name: str):

    if any(p['name'] == name for p in all_pokemon):
        captured_pokemon.add(name)
        return jsonify({'message': f'{name} marked as captured.'})
    return jsonify({'error': 'Pokemon not found.'}), 404 

@app.route('/release/<name>', methods=['POST'])
def release_pokemon(name: str):
    if name in captured_pokemon:
        captured_pokemon.remove(name)
        return jsonify({'message': f'{name} released.'})
    return jsonify({'error': 'Pokemon not found or not captured.'}), 404

if __name__=='__main__':
    app.run(port=8080, debug=True)
