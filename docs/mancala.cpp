#include <iostream>
#include <iomanip>
#include <fstream>
#include <vector>
#include <sstream>
#include <math.h>
#include <glut.h>
#include "glui.h"
#include "ilut.h"

#define RESET 100
#define PLAY 200
using namespace std;

//#define _DEBUG_INFO

int isc = 3; // initial stone count
vector<int> board;
int move = 0;
bool game_over = false;
int max_ply[2] = {4,6};
int best_child = 0;
ofstream log_file;



float bottom_x = -.62;
float bottom_y = -.6;
float top_x = -.62;
float top_y = .16;

float goal_1_x = .77;//1.5;
float goal_1_y = -0.5;//.6;
float goal_2_x = -.85;//1.5;
float goal_2_y = -0.5;//.6;

float score_1_x = .92;
float score_1_y = -.95;
float score_2_x = -.95;
float score_2_y = -.95;

float pit_hspace = .234;
float pit_vspace = 1.2;




GLuint image;
ILuint texid;

int difficulty = 0;
int play_mode = 0;
GLUI_RadioGroup *radio;
GLUI *glui;
GLUI_Panel *diff_panel;
GLUI_Panel *play_mode_panel, *stones_panel;
GLUI_Spinner *spinner;
float sf = .35; // window ratio

void renderBitmapString( float x, float y, float z, void *font, char *string )
{  
    char *c;
    glRasterPos3f(x, y,z);

    for (c=string; *c != '\0'; c++)
        glutBitmapCharacter(font, *c);
}

void init_board(vector<int> &state)
{
    state.clear();

	for (int i = 0; i < 6; i++)
		state.push_back(isc);

	state.push_back(0);

	for (int i = 0; i < 6; i++)
		state.push_back(isc);

	state.push_back(0);

    move = 0;
    game_over = false;
    best_child = 0;
}

int
get_turn()
{
	return move % 2;
}

void
end_game()
{
	cout << "Game Over." << endl;
	game_over = true;
}
void mydisplay();
void draw_delayed_frame()
{
    mydisplay();
}


bool
do_move( vector<int> &state, int pit, bool animate )
{
#ifdef _DEBUG_INFO
	log_file << "Trying pit: " << pit << " Stones count: " << state[pit] << endl;
#endif
	int turn = get_turn();

	// Is this a valid move?
	if ( (turn == 0 && (pit < 0 || pit > 5))
		|| (turn == 1 && (pit < 7 || pit > 12))
		|| state[pit] == 0)
	{
		return false;
	}

	int stones = state[pit];
	state[pit] = 0;
            if (animate) draw_delayed_frame();
	int pit_num = pit;

	while(stones)
	{
		pit++;
		pit_num = pit % 14;

		if ( (turn == 0 && pit_num == 13) || (turn == 1 && pit_num == 6))
			continue;

		state[pit_num]++;

        if (animate) draw_delayed_frame();

		stones--;
	}

	// Rule 2.
	int opposite_pit = 12 - pit_num;

	if ( turn == 0 && pit_num < 6 && state[pit_num] == 1 &&  state[opposite_pit] > 0 )
	{
		state[6] += state[opposite_pit] + 1;
		state[pit_num] = state[opposite_pit] = 0;
        if (animate) draw_delayed_frame();
	}
	else if ( turn == 1 && pit_num < 13 && pit_num > 6 && state[pit_num] == 1 &&  state[opposite_pit] > 0 )
	{
		state[13] += state[opposite_pit] + 1;
		state[pit_num] = state[opposite_pit] = 0;
        if (animate) draw_delayed_frame();
	}

	// Rule 3 for player 1.
	int my_sum = 0;

	if ( turn == 0 )
	{
		for (int i = 0; i < 6; i++)
		{
			my_sum += state[i];
		}

		if (my_sum == 0)
		{
			int their_sum = 0;

			for (int j = 7; j < 13; j++)
			{
				their_sum += state[j];
				state[j] = 0;
			}

			state[13] += their_sum;
//			end_game();
		}
	}
	else
	{
		for (int i = 7; i < 13; i++)
		{
			my_sum += state[i];
		}

		if (my_sum == 0)
		{
			int their_sum = 0;

			for (int j = 0; j < 6; j++)
			{
				their_sum += state[j];
				state[j] = 0;
			}

			state[6] += their_sum;
//			end_game();
		}
	}

	// Rule 1.
	if ( (turn == 0 && pit_num == 6) || (turn == 1 && pit_num == 13) )
		return true;

	move++;
	return true;
}

void draw_sphere( float x, float y, float z, float r )
{
	glPushMatrix();
	glTranslatef( x, y, z );
	glutSolidSphere(r,32,32);
	glPopMatrix();
}

void draw_stones( int stone_count, int stones_per_row )
{   
    glPushMatrix();

    float x_offset = 0.0;
    float y_offset = 0.0;

    float stone_r = .04;
    float stone_spacing = .11;

    glColor3f(1.0, 1.0, 1.0);

    glScalef(sf, 1.0, 1.0 );

    for (int i = 1; i <= stone_count; ++i)
    {
           glColor3f(1.0,1.0,1.0);
        glutSolidSphere(stone_r,300,300);
        glTranslatef( stone_spacing, 0.0, 0.0 );

        if (i % stones_per_row == 0)
        {
            glTranslatef( -stone_spacing*stones_per_row, stone_spacing, 0.0 );
        }
    }

    glPopMatrix();
}


void
display(vector<int> &brd, int depth)
{

	stringstream ss;

	for(int k = 0; k < depth; k++)
		ss << "           ";
	
	string s(ss.str());
	cout << endl << s << "Turn: " << get_turn() << endl;
#ifdef _DEBUG_INFO
	log_file << endl << s << "Turn: " << get_turn() << endl;
#endif

	cout << s  << "   ";
	log_file << s  << "   ";

	for (int i = 12; i > 6; i--)
	{
		cout << setw(2) << brd[i] << " ";
#ifdef _DEBUG_INFO
		log_file << setw(2) << brd[i] << " ";
#endif
	}

	cout << endl;
	cout << s  << setw(2) << brd[13] << "                    " << setw(2) << brd[6] << endl;
	cout << s  << "   ";
#ifdef _DEBUG_INFO
	log_file << endl;
	log_file << s << setw(2) << brd[13] << "                    " << setw(2) << brd[6] << endl;
	log_file << s << "   ";
#endif

	for (int i = 0; i < 6; i++)
	{
		cout << setw(2) << brd[i] << " ";
#ifdef _DEBUG_INFO
		log_file << setw(2) << brd[i] << " ";
#endif
	}

	cout << endl << endl;
#ifdef _DEBUG_INFO
	log_file << endl << endl;
#endif
}

void
displayUserControls()
{
	cout << "--------------------" << endl;
	cout << "    1| 2| 3| 4| 5| 6" << endl;
}

void
displayLog(vector<int> &brd, int depth)
{
	stringstream ss;

	for(int k = 0; k < depth; k++)
		ss << "           ";
	
	string s(ss.str());
	log_file << endl << s << "Turn: " << get_turn() << endl;

	log_file << s  << "   ";

	for (int i = 12; i > 6; i--)
	{
		log_file << brd[i] << " ";
	}

	log_file << endl;
	log_file << s  << brd[13] << "               " << brd[6] << endl;
	log_file << s  << "   ";

	for (int i = 0; i < 6; i++)
	{
		log_file << brd[i] << " ";
	}

	log_file << endl << endl;
}

void
gen_moves(vector<int> &state, vector<int> &moves)
{
	int turn = get_turn();
	int min_val, max_val;

	if (turn == 0)
	{	
		min_val = 0;
		max_val = 5;
	}
	else
	{
		min_val = 7;
		max_val = 12;
	}

	for (int i = min_val; i <= max_val; i++)
	{
		if (state[i] != 0)
			moves.push_back(i);
	}
}

bool isTerminalState( vector<int> state )
{
//	if( state[6] > 6*isc || state[13] > 6*isc)
//		return true;
	
	int sum = 0;
	for(int i = 0; i < 6; i++)
		sum += state[i];
	if(sum == 0)
		return true;
	
	sum = 0;
	for(int i = 7; i < 13; i++)
		sum += state[i];
	if(sum == 0)
		return true;

	return false;
}

int
negamax( vector<int> state, int depth, int max )
{
	int best_utility;
	int new_value;
	// if the depth is 0 or we are at a terminal node, return
	// the evaluation of this current board which is the difference
	// between the two pits.

	log_file << "negamax(state, " << depth << ");" << endl;
	if( depth == 0 || isTerminalState(state))
	{
//		move--;
		int k = 1;
//		if(get_turn() == 1)
//			k = -1;

		int eval = ((2*max)-1) * (state[13] - state[6]);
#ifdef _DEBUG_INFO
		displayLog(state, depth);
		log_file << "Depth 0 reached, returning " << eval << endl;
#endif
        return eval;
	}
    // otherwise we are not at a terminal node or the max depth
	// so we must use minmax to go down to the leaf nodes and 
	// propagate the values returned back up to the root
	else
	{
		vector<int> moves;
		gen_moves(state, moves);

		int last_turn = get_turn();
		int turn_now = get_turn();

		if(turn_now == max) // if it's the computers turn, try to maximize
		{
			best_utility = -9999;
			for (unsigned int i = 0; i < moves.size(); i++)
			{
				vector<int> child_state = state;


				do_move(child_state, moves[i], false);
#ifdef _DEBUG_INFO
				displayLog(child_state, depth);
#endif

				if(turn_now != get_turn())
				{
					move--;
				}
				new_value = negamax(child_state, depth-1, max);

				if (best_utility < new_value) 
				{
					best_utility = new_value;
#ifdef _DEBUG_INFO			
					log_file << "moves[i]: " << moves[i] << endl;
#endif
					if(depth == max_ply[max])
						best_child = moves[i];
				}
#ifdef _DEBUG_INFO			
			log_file << endl << "MAX" << endl;
			log_file << "-----------------------" << endl;
			log_file << "New Value: " << new_value << endl;
			log_file << "best_utility: " << best_utility << endl;
			log_file << "best_child: " << best_child << endl << endl;
#endif
			}
		}
		else
		{
			// if it is the human player, try to minimize
			best_utility = 9999;
			for (unsigned int i = 0; i < moves.size(); i++)
			{
				vector<int> child_state = state;

				do_move(child_state, moves[i], false);
#ifdef _DEBUG_INFO
				displayLog(child_state, depth);
#endif
				
				if(turn_now != get_turn())
				{
					move--;
				}
				new_value = negamax(child_state, depth-1, max);

				if (best_utility > new_value) 
				{
					best_utility = new_value;
#ifdef _DEBUG_INFO			
					log_file << "moves[i]: " << moves[i] << endl;
#endif
					if(depth == max_ply[max])
						best_child = moves[i];
				}
#ifdef _DEBUG_INFO			
			log_file << endl << "MIN" << endl;
			log_file << "-----------------------" << endl;
			log_file << "New Value: " << new_value << endl;
			log_file << "best_utility: " << best_utility << endl;
			log_file << "best_child: " << best_child << endl << endl;
#endif
			}
		}
	}
	
#ifdef _DEBUG_INFO			
	log_file << "Returning best_utility = " << best_utility << " at depth=" << depth << endl;
#endif
	return best_utility;
}

void 
ai_move(int max)
{
	cout << "AI is thinking..." <<  max_ply[max] << endl;
	negamax( board, 6, max );
#ifdef _DEBUG_INFO			
	log_file << "\nAI MOVE: " << best_child << endl;
#endif
	move=max;
	cout << "\nAI moving " << board[best_child] << " stones from pit " << best_child << endl;
	do_move( board, best_child, true );
}


void
play_game()
{
	int pit;

	while (!game_over)
	{
		if (get_turn() == 0)
		{
			displayUserControls();
			cout << "Pit? ";
#ifdef _DEBUG_INFO			
			log_file << "Pit? ";
#endif
			cin >> pit;
#ifdef _DEBUG_INFO			
			log_file << pit << endl;
#endif
			pit--;
			if(pit < 0)
				return;

			if (!do_move(board, pit, true))
			{
				cout << "Move was illegal.  Try again." << endl;
				continue;
			}

			ai_move(0);
		}
		else if (get_turn() == 1 && !game_over)
		{
			ai_move(1);
		}

		game_over = isTerminalState(board);
	}

	cout << endl << "GAME OVER!" << endl;
	if(board[6] > board[13])
		cout << "You won!!!" << endl;
	else if(board[13] > board[6])
		cout << "You've been served!" << endl;
	else
		cout << "It's a tie.  Can't you do any better?" << endl;
}

void reshape(int w, int h) {}


int 
get_xy_as_pit(int x, int y)
{

/*
    for (int i = 0; i < 6; i++)
    {   
        if
    }*/
    return 1;
}

void mydisplay()
{
    glPushMatrix();
    glClear(GL_COLOR_BUFFER_BIT);

    glEnable(GL_TEXTURE_2D);
    glBegin(GL_QUADS);
	glTexCoord2f(0.0, 0.0); glVertex3f(-1.0, -1.0, -.1);
    glTexCoord2f(1.0, 0.0); glVertex3f(1.0, -1.0, -.1);
	glTexCoord2f(1.0, 1.0);  glVertex3f(1.0, 1.0, -.1);
	glTexCoord2f(0.0, 1.0); glVertex3f(-1.0, 1.0, -.1);
    glEnd();
    glDisable(GL_TEXTURE_2D);
    glPushMatrix();
 
    float x_offset = 0.0f;
    glTranslatef( bottom_x, bottom_y, 0.0 );

    for (int i = 0; i < 6; i++)
    {

        draw_stones( board[i], 3 );
        glTranslatef( pit_hspace, 0.0, 0.0 );
    }

    glPopMatrix();
    glPushMatrix();
    glTranslatef( top_x, top_y, 0.0 );

    for (int i = 12; i > 6; i--)
    {
        draw_stones( board[i], 3 );
        glTranslatef( pit_hspace, 0.0, 0.0 );
    }


    glPopMatrix();
    glPushMatrix();

    glTranslatef( goal_1_x, goal_1_y, 0.0 );
    draw_stones( board[6], 3 );

    glPopMatrix();
    glPushMatrix();

    glTranslatef( goal_2_x, goal_2_y, 0.0 );
    draw_stones( board[13], 3 );

    glPopMatrix();



	char c_val[32];
	sprintf_s( c_val, "%d", board[6] );
	renderBitmapString( score_1_x, score_1_y, 0, GLUT_BITMAP_TIMES_ROMAN_24,  c_val);

    ::memset(c_val, '\0', 32);
	sprintf_s( c_val, "%d", board[13] );
	renderBitmapString( score_2_x, score_2_y, 0, GLUT_BITMAP_TIMES_ROMAN_24,  c_val);


    glFlush();

	glutSwapBuffers();
    glPopMatrix();
}

void mouse_button(int button, int state, int x, int y)
{
    switch (button)
	{
		case GLUT_LEFT_BUTTON:
            int pit = get_xy_as_pit(x, y);
			break;
	}
}

//void MancalaUI::mouse_motion() {}
void keyboard(unsigned char key, int x, int y) {

    int pit = (int)key - 48;

    if (pit >= 0 && pit <= 5 && !game_over)
    {
        if(!do_move(board, pit, true))
        {
            cout << "Move was illegal.  Try again." << endl;
            return;
        }

        game_over = isTerminalState(board);
        glutPostRedisplay();

        while (get_turn() == 1 && !game_over)
        {
            ai_move(1);
            game_over = isTerminalState(board);
        }
    }
}




void control_cb( int control )
{
    if (control == RESET)
    {
        //display(board, 0);
        init_board(board);
        mydisplay();
        //display(board, 0);
    }
    
}

int main( int argc, char** argv)
{  
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowSize(850, 298);
    glutCreateWindow("Mancala!");
    glutReshapeFunc(reshape);
    glutDisplayFunc(mydisplay);
    glutMouseFunc(mouse_button);
    //glutMotionFunc(mouse_motion);
    glutKeyboardFunc(keyboard);



	init_board(board);
    glui = GLUI_Master.create_glui( "Mancala!", 0, 400, 50 );

    stones_panel =  glui->add_panel( "Number of Stones" );
    spinner = glui->add_spinner_to_panel( stones_panel, "",
					 GLUI_SPINNER_INT, &isc);
    spinner->set_int_limits( 3, 10 );
    spinner->set_alignment( GLUI_ALIGN_RIGHT );

    diff_panel = glui->add_panel( "Difficulty" );
    radio = glui->add_radiogroup_to_panel(diff_panel, &difficulty, 4, control_cb);
    glui->add_radiobutton_to_group( radio, "Easy" );
    glui->add_radiobutton_to_group( radio, "Better..." );
    glui->add_radiobutton_to_group( radio, "Scary" );

    play_mode_panel = glui->add_panel( "Play Mode" );
    radio = glui->add_radiogroup_to_panel(play_mode_panel,&play_mode,4,control_cb);
    glui->add_radiobutton_to_group( radio, "Human vs. Human" );
    glui->add_radiobutton_to_group( radio, "Human vs. Computer" );
    glui->add_radiobutton_to_group( radio, "Computer vs. Computer" );

    //glui->add_button( "Play", PLAY, control_cb );
    glui->add_button( "Reset", RESET, control_cb );
    glui->add_button( "Quit", 0,(GLUI_Update_CB)exit );


    ilInit(); /* Initialization of DevIL */
    iluInit();
    ilutInit();
    ilGenImages(1, &texid); /* Generation of one image name */
    ilBindImage(texid); /* Binding of image name */
    const char* iname = "mancala2.png";
    ILboolean success = ilLoadImage((const ILstring)iname); /* Loading of image "image.jpg" */

    if (success)
    {

        success = 1;//ilConvertImage(IL_RGB, IL_UNSIGNED_BYTE); /* Convert every colour component into
                 // unsigned byte. If your image contains alpha channel you can replace IL_RGB with IL_RGBA */

        if (success)
        {
            glGenTextures(1, &image); /* Texture name generation */
            glBindTexture(GL_TEXTURE_2D, image); /* Binding of texture name */

            glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR); /* We will use linear
            interpolation for magnification filter */
            glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR); /* We will use linear
            interpolation for minifying filter */

            ILubyte *Data = ilGetData();

            glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, ilGetInteger(IL_IMAGE_WIDTH),
            ilGetInteger(IL_IMAGE_HEIGHT), 0, GL_RGB, GL_UNSIGNED_BYTE,Data); /* Texture specification */

            ilDeleteImages(1, &texid); /* Because we have already copied image data into texture data
            we can release memory used by image. */
        }
        else
        {
            cerr << "Failed converting image: " << iname << endl;
        }
    }
    else
    {
        cerr << "Failed loading image: " << iname << endl;
    }

    glutMainLoop();

	return 1;
}
