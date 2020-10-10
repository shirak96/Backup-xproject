extends TextureButton

onready var buttonLabel:Label = get_node("Label");

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta: float) -> void:
#	pass




func _on_Button_mouse_entered() -> void:
	buttonLabel.add_color_override("font_color", Color("#f48e2c"));


func _on_Button_mouse_exited() -> void:
	buttonLabel.add_color_override("font_color", Color(255,255,255));
