################################################################################
#
#  du2rrd
#
#  http://oss.oetiker.ch/optools/wiki/du2rrd
#
#  Copyright:
#    2007 OETIKER+PARTNER AG, http://oetiker.ch
#
#  License:
#    GPL: http://www.gnu.org/licenses/gpl.html
#
#  Authors:
#    * Tobias Oetiker (oetiker)
#
################################################################################
# the qooxdoo build system need at least python 2.4
export PATH:=/usr/pack/python-debian31-2.4.4-to/bin:$(PATH)

################################################################################
# SETTINGS
################################################################################

#
# Path to the folder of your qooxdoo distribution.
# Can either be
# a) a relative path to the location of this Makefile (preferred) or
# b) an absolute path starting at the root of your file system
# Example: If you put the skeleton folder next to the qooxdoo SDK folder,
# you can use the following relative path:
# QOOXDOO_PATH = ../../qooxdoo-0.7-sdk
# Please note that Windows users should always use relative paths.
# It should end with the last directory. Please omit a trailing slash.
#
# qooxdoo link is a symlink pointing 'relative' to the root of the qooxdoo sdk
QOOXDOO_PATH = qooxdoolink
QOOXDOO_URI = ../qooxdoolink
#QOOXDOO_URI = file:///Q:/$(QOOXDOO_PATH)


#
# Namespace of your application e.g. custom
# Even complexer stuff is possible like: net.sf.custom
#
APPLICATION_NAMESPACE = du2rrd

#
# Files that will be copied from the source directory into the build
# directory (space separated list). The default list is empty.
#
APPLICATION_FILES = index.html du2rrd.cgi perl
# APPLICATION_BUILD_LOG_LEVEL = debug
APPLICATION_BUILD_LOG_LEVEL = off

#-------------------------------------------------------------------------------
# For a full list and description of available application settings, please 
# see the APPLICATION variables in file 
# $(QOOXDOO_PATH)/frontend/framework/tool/make/application.mk
# Add any of those variables for your custom configuration here:
#-------------------------------------------------------------------------------
APPLICATION_LOCALES = en de

APPLICATION_RESOURCE_FILTER = true
#APPLICATION_COMPLETE_SOURCE = false
APPLICATION_THEME_ICON = qx.theme.icon.CrystalClear

# these are set by default
#APPLICATION_OPTIMIZE_STRINGS = true
#APPLICATION_OPTIMIZE_VARIABLES = true
#APPLICATION_OPTIMIZE_BASE_CALL = true
#APPLICATION_OPTIMIZE_PRIVATE = false
#APPLICATION_OPTIMIZE_BROWSER = false
#APPLICATION_INDIVIDUAL_BROWSERS = gecko mshtml opera webkit
#APPLICATION_OPTIMIZE_REMOVE_DEBUG = true

#APPLICATION_OPTIMIZE_REMOVE_COMPATIBILITY = false
# these are changed against default


################################################################################
# INTERNALS (PLEASE DO NOT CHANGE)
################################################################################
ifneq ($(QOOXDOO_PATH),PLEASE_DEFINE_QOOXDOO_PATH)
	include $(QOOXDOO_PATH)/frontend/framework/tool/make/targets.mk
#	include $(QOOXDOO_PATH)/frontend/framework/tool/make/application.mk
	include ./my-application.mk
endif

#####################
# Additional settings
#####################

FRAMEWORK_CACHE_PATH=/tmp/qooxdoo-${USER}

error:
	@echo "  * Please configure QOOXDOO_PATH"
