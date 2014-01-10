test: Generated/rncryptor-vectors.js
	phantomjs runner.js rncryptor-test.html

Generated/rncryptor-vectors.js: Makefile GenVectorTests ../Spec/vectors/v3/kdf_short
	./GenVectorTests -o $@ -3 ../Spec/vectors/v3
