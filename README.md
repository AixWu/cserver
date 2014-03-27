=cServer=

A small C-Server pages implementation.  The grammar works pretty well,
but the runtime code is incomplete (or rather, it's complete but not
fully secure yet).  The grammar parser uses PLY (LALR), but only because I wanted
the ability to do fairly advanced parsing.  That didn't quite happen, ]
and I'll probably rewrite it with simple regexpr's (which is really
what it's using now, using PLY's lexer interface) sometime in the future.

The syntax is simple, there's basically three tags:

```
<!--execute c code-->
<# 
c code
#>

<!--output a c variable; for strings, you can--> 
<!--use either 'char*' or 'str' for c-type-->
<#=[c-type] variable-name #>

<!--include another file-->
<#include "filename.ccs" #>
```

=Requirements=
Python >= 3.1
PyPLY ( http://www.dabeaz.com/ply/ )

=Compiling=
Download and install Python3 and PLY, open a 
shell, then do this:

  python cs_build.py

The source files defined in cs_sources.py will be built
in build/, then concatenated into the main C file, 
build/pages.c

Note that there is some (annotated) ES6 code in es6code/.
You don't shouldn't need to compile it to use the cserver
compiler itself; it's just browser run-time JS code.