tool
extends Control



export var displayTitle = "::Title::" setget setLabel, getTitle;
export var inputPlaceHolder = "PlaceHolder" setget UpdatePlaceHolder, _getPlaceHolder;
export var displayDescription = false setget setDescription, getDescription;



# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	setLabel(getTitle());
	UpdatePlaceHolder(_getPlaceHolder())
	setDescription(getDescription())



func setLabel(_title):
	if($Label):
		$Label.text = _title;

func UpdatePlaceHolder(placeHolderText):
	if($LineEdit):
		$LineEdit.placeholder_text =placeHolderText;

func getTitle():
	if($Label):
		return $Label.text;

func _getPlaceHolder():
	if($LineEdit):
		return $LineEdit.placeholder_text;

func setDescription(showDiscription):
	displayDescription = showDiscription;
	if($TextEdit):
		if(displayDescription):
			$TextEdit.show();
			$LineEdit.hide();
		else:
			$TextEdit.hide();
			$LineEdit.show();

func getDescription():
	return displayDescription;

func GetInput():
	if(displayDescription):
		return $TextEdit.text;
	else:
		return $LineEdit.text;

func ClearInput():
	if(displayDescription):
		$TextEdit.text = "";
	else:
		$LineEdit.text = "";

func AddInput(text):
	if(displayDescription):
		$TextEdit.text = str(text);
	else:
		$LineEdit.text = str(text);
