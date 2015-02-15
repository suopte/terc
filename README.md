suopte Remote Control (teRC)
============================

GNU/Linux remote control inspired by and based on the great [Linux Remote Control Application](https://github.com/Agneli/linux-remote-control) for Firefox OS.

UI has been simplified and extended with a full (currently only Hungarian) keyboard including cursor and function keys.

License
-------

This software is published under the GNU GPL with the "feeling of harmony".  
([Richard Stallman - The GNU Manifesto](https://www.gnu.org/gnu/manifesto.html#why-help)).

Autostart on login
------------------
Add the following lines to the end of `~/.profiles` substituting `<path-to-terc>` with the path to teRC:

	if [ -n "${DISPLAY:+1}" ]; then
			cd <path-to-terc>
			nohup node terc.js > output &
			cd
	fi

It only starts teRC if you login through a graphic interface.
